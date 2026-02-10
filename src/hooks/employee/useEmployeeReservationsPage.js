import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import ReservationStatusService from '../../api/services/ReservationStatusService';
import VehicleService from '../../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import { enrichReservations, resolveReservationErrorMessage } from '../../utils/reservationData';
import {
  buildReservationPayload,
  mapReservationToFormData,
  validateReservationForm
} from '../../forms/reservationFormUtils';
import { filterReservationStatusesByLocale } from '../../utils/reservationStatusUtils';
import { useAuth } from '../core/useAuth';
import useFormState from '../core/useFormState';
import useHeadquarters from '../location/useHeadquarters';
import useLocale from '../core/useLocale';
import { createEmptyPaginationState, createPaginationState, updateFilterValue } from '../_internal/orchestratorUtils';

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

const clearFieldError = (setErrors, name) => {
  setErrors((prev) => {
    if (!prev[name]) return prev;
    return Object.assign({}, prev, { [name]: null });
  });
};

function useEmployeeReservationsPage() {
  const locale = useLocale();
  const { token, user } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(createEmptyPaginationState);

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
    user?.employeeId || user?.employee?.employeeId || user?.employee?.id || ''
  ), [user]);

  const loadReservations = useCallback(async ({
    nextFilters = DEFAULT_FILTERS,
    pageNumber = PAGINATION.DEFAULT_PAGE
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ReservationService.search({
        reservationId: nextFilters.reservationId || undefined,
        vehicleId: nextFilters.vehicleId || undefined,
        userId: nextFilters.userId || undefined,
        reservationStatusId: nextFilters.reservationStatusId || undefined,
        pickupHeadquartersId: nextFilters.pickupHeadquartersId || undefined,
        returnHeadquartersId: nextFilters.returnHeadquartersId || undefined,
        startDateFrom: nextFilters.startDateFrom || undefined,
        startDateTo: nextFilters.startDateTo || undefined,
        endDateFrom: nextFilters.endDateFrom || undefined,
        endDateTo: nextFilters.endDateTo || undefined,
        pageNumber,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });

      const results = response?.results ?? [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / PAGINATION.DEFAULT_PAGE_SIZE));
      const hydratedReservations = await enrichReservations(results, {
        canFetchStatuses: true,
        isoCode: locale
      });

      setReservations(hydratedReservations);
      setPagination(createPaginationState({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      }));
    } catch (err) {
      setError(resolveReservationErrorMessage(err) || MESSAGES.ERROR_LOADING_DATA);
      setReservations([]);
      setPagination(createEmptyPaginationState());
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadReservations({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadReservations]);

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
        setVehicles(response?.results || response || []);
      } else {
        setVehicles([]);
      }

      if (statusesResult.status === 'fulfilled') {
        setStatuses(filterReservationStatusesByLocale(statusesResult.value || [], locale));
      } else {
        setStatuses([]);
      }
    };

    loadMetadata().catch(() => {});
  }, [locale]);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback(() => {
    loadReservations({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadReservations]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadReservations({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadReservations]);

  const handlePageChange = useCallback((nextPage) => {
    loadReservations({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadReservations]);

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
