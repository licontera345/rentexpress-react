import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import ReservationStatusService from '../../api/services/ReservationStatusService';
import VehicleService from '../../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import { resolveReservationErrorMessage } from '../../utils/reservationData';
import {
  buildReservationPayload,
  mapReservationToFormData,
  validateReservationForm
} from '../../utils/reservationFormUtils';
import { useAuth } from '../core/useAuth';
import useFormState from '../core/useFormState';
import useHeadquarters from '../location/useHeadquarters';
import useLocale from '../core/useLocale';
import usePaginatedSearch from '../core/usePaginatedSearch';
import { clearFieldError } from '../_internal/orchestratorUtils';

const normalizeIsoCode = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

// Dedup por id, y si hay `language[]` prefiere el que coincida con el locale.
const normalizeReservationStatuses = (items, locale) => {
  const list = Array.isArray(items) ? items : [];
  const targetLocale = normalizeIsoCode(locale);
  const byId = new Map();

  const score = (status) => {
    const hasName = typeof status?.statusName === 'string' && status.statusName.trim() ? 1 : 0;
    const langs = Array.isArray(status?.language) ? status.language : [];
    const matches = targetLocale
      ? langs.some((l) => normalizeIsoCode(l?.isoCode) === targetLocale)
      : false;
    return (matches ? 10 : 0) + hasName;
  };

  for (const status of list) {
    const id = status?.reservationStatusId;
    if (id == null) continue;
    const key = Number(id);
    const existing = byId.get(key);
    if (!existing || score(status) > score(existing)) {
      byId.set(key, status);
    }
  }

  return Array.from(byId.values());
};

const DEFAULT_FILTERS = {
  reservationId: '',
  vehicleId: '',
  userId: '',
  reservationStatusId: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  startDateFrom: '',
  startDateTo: '',
  endDateFrom: '',
  endDateTo: ''
};

const buildReservationSearchCriteria = (filters, pageNumber) => ({
  reservationId: filters.reservationId || undefined,
  vehicleId: filters.vehicleId || undefined,
  userId: filters.userId || undefined,
  reservationStatusId: filters.reservationStatusId || undefined,
  pickupHeadquartersId: filters.pickupHeadquartersId || undefined,
  returnHeadquartersId: filters.returnHeadquartersId || undefined,
  startDateFrom: filters.startDateFrom || undefined,
  startDateTo: filters.startDateTo || undefined,
  endDateFrom: filters.endDateFrom || undefined,
  endDateTo: filters.endDateTo || undefined,
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});

const DEFAULT_RESERVATION_FORM_DATA = {
  vehicleId: '',
  userId: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  reservationStatusId: ''
};

function useEmployeeReservationsPage() {
  const locale = useLocale();
  const { token, user } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();

  const fetchReservations = useCallback(async (criteria) => {
    try {
      const response = await ReservationService.search(criteria);
      return {
        results: response?.results ?? [],
        totalRecords: response?.totalRecords,
        totalPages: response?.totalPages,
        pageNumber: response?.pageNumber
      };
    } catch (err) {
      throw new Error(resolveReservationErrorMessage(err) || MESSAGES.ERROR_LOADING_DATA);
    }
  }, [locale]);

  const search = usePaginatedSearch({
    defaultFilters: DEFAULT_FILTERS,
    buildCriteria: buildReservationSearchCriteria,
    fetch: fetchReservations,
    defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    errorMessage: MESSAGES.ERROR_LOADING_DATA
  });

  const {
    items: reservations,
    loading,
    error,
    filters,
    pagination,
    loadItems: loadReservations,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange
  } = search;

  const createForm = useFormState({
    initialData: DEFAULT_RESERVATION_FORM_DATA,
    mapData: mapReservationToFormData
  });
  const editForm = useFormState({
    initialData: DEFAULT_RESERVATION_FORM_DATA,
    mapData: mapReservationToFormData
  });

  const [vehicles, setVehicles] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [pageAlert, setPageAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editReservationId, setEditReservationId] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const employeeId = useMemo(() => (
    user?.employeeId ?? ''
  ), [user]);

  useEffect(() => {
    const loadMetadata = async () => {
      const [vehiclesResult, statusesResult] = await Promise.allSettled([
        VehicleService.search({
          pageNumber: PAGINATION.DEFAULT_PAGE,
          pageSize: PAGINATION.MAX_PAGE_SIZE
        }),
        ReservationStatusService.getAll(locale)
      ]);

      if (vehiclesResult.status === 'fulfilled') {
        const response = vehiclesResult.value;
        setVehicles(response?.results || []);
      } else {
        setVehicles([]);
      }

      if (statusesResult.status === 'fulfilled') {
        // La API ya devuelve los estados traducidos/filtrados por isoCode.
        setStatuses(normalizeReservationStatuses(statusesResult.value || [], locale));
      } else {
        setStatuses([]);
      }
    };

    loadMetadata().catch(() => {});
  }, [locale]);

  const handleCreateChange = useCallback((event) => {
    createForm.handleFormChange(event);
    const { name } = event.target;
    clearFieldError(setCreateErrors, name);
    createForm.setFormAlert(null);
  }, [createForm]);

  const handleEditChange = useCallback((event) => {
    editForm.handleFormChange(event);
    const { name } = event.target;
    clearFieldError(setEditErrors, name);
    editForm.setFormAlert(null);
  }, [editForm]);

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateOpen(true);
    createForm.setFormAlert(null);
    setCreateErrors({});
  }, [createForm]);

  const closeCreateModal = useCallback(() => {
    setIsCreateOpen(false);
    createForm.resetForm();
    setCreateErrors({});
  }, [createForm]);

  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
    setEditReservationId(null);
    setIsEditLoading(false);
    editForm.resetForm();
    setEditErrors({});
  }, [editForm]);

  const handleCreateReservation = useCallback(async (event) => {
    event.preventDefault();

    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    const nextErrors = validateReservationForm(createForm.formData, {
      requireVehicleId: true,
      requireUserId: true,
      requireStatus: true
    });
    setCreateErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      const payload = buildReservationPayload(createForm.formData, { employeeId });
      await ReservationService.create(payload);
      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RESERVATION_CREATED });
      createForm.resetForm();
      setCreateErrors({});
      await loadReservations({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      createForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [createForm, employeeId, filters, loadReservations, pagination.pageNumber, token]);

  const handleEditReservation = useCallback(async (reservationId) => {
    if (!reservationId) return;
    setIsEditOpen(true);
    setEditReservationId(reservationId);
    editForm.setFormAlert(null);

    const cachedReservation = reservations.find((item) => (item.reservationId ?? item.id) === reservationId);
    if (cachedReservation) {
      editForm.populateForm(cachedReservation);
      return;
    }

    setIsEditLoading(true);
    try {
      const reservation = await ReservationService.findById(reservationId);
      editForm.populateForm(reservation);
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, reservations]);

  const handleUpdateReservation = useCallback(async (event) => {
    event.preventDefault();

    if (!token) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    if (!editReservationId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.RESERVATION_NOT_FOUND });
      return;
    }

    const nextErrors = validateReservationForm(editForm.formData, {
      requireVehicleId: true,
      requireUserId: true,
      requireStatus: true
    });
    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);

    try {
      const payload = buildReservationPayload(editForm.formData, { employeeId });
      await ReservationService.update(editReservationId, payload);
      editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RESERVATION_UPDATED });
      await loadReservations({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setIsEditOpen(false);
      setEditReservationId(null);
      setEditErrors({});
      editForm.resetForm();
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_UPDATING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editForm, editReservationId, employeeId, filters, loadReservations, pagination.pageNumber, token]);

  const handleDeleteReservation = useCallback(async (reservationId) => {
    if (!reservationId) return;

    if (!token) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_RESERVATION);
    if (!confirmed) return;

    setPageAlert(null);
    try {
      await ReservationService.delete(reservationId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RESERVATION_DELETED });
      await loadReservations({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadReservations, pagination.pageNumber, token]);

  return {
    state: {
      headquarters,
      reservations,
      filters,
      vehicles,
      statuses,
      createForm,
      editForm,
      createErrors,
      editErrors
    },
    ui: {
      headquartersLoading,
      headquartersError,
      isLoading: loading,
      error,
      pageAlert,
      isSubmitting,
      isCreateOpen,
      isEditOpen,
      isEditLoading
    },
    actions: {
      handleFilterChange,
      applyFilters,
      resetFilters,
      handlePageChange,
      setPageAlert,
      handleCreateChange,
      handleEditChange,
      handleOpenCreateModal,
      handleCreateReservation,
      handleEditReservation,
      handleUpdateReservation,
      handleDeleteReservation,
      closeCreateModal,
      closeEditModal
    },
    meta: {
      pagination
    }
  };
}

export default useEmployeeReservationsPage;
