import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import { ReservationStatusService } from '../../api/services/CatalogService';
import VehicleService from '../../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import { buildReservationFilterFields } from '../../utils/filter/filterFieldBuilders';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { resolveReservationErrorMessage } from '../../utils/form/apiFormUtils';
import {
  buildReservationPayload,
  mapReservationToFormData,
  validateReservationForm
} from '../../utils/reservation/reservationUtils';
import {
  normalizeReservationStatuses,
  EMPLOYEE_RESERVATION_DEFAULT_FILTERS,
  buildReservationSearchCriteria,
  EMPLOYEE_RESERVATION_FORM_INITIAL_DATA,
} from '../../utils/reservation/reservationEmployeeUtils';
import { useAuth } from '../core/useAuth';
import useFormState from '../core/useFormState';
import useHeadquarters from '../location/useHeadquarters';
import useLocale from '../core/useLocale';
import usePaginatedSearch from '../core/usePaginatedSearch';
import { handleFormChangeAndClearError, withSubmitting } from '../_internal/orchestratorUtils';

// Hook para la página de reservas del empleado.
function useEmployeeReservationsPage() {
  const locale = useLocale();
  const { token, user } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();

  // Carga las reservas con los criterios proporcionados.
  const fetchReservations = useCallback(async (criteria) => {
    try {
      const response = await ReservationService.search(criteria);
      return {
        results: getResultsList(response),
        totalRecords: response?.totalRecords ?? response?.totalElements,
        totalPages: response?.totalPages,
        pageNumber: response?.pageNumber ?? (response?.number != null ? response.number + 1 : undefined)
      };
    } catch (err) {
      throw new Error(resolveReservationErrorMessage(err) || MESSAGES.ERROR_LOADING_DATA);
    }
  }, []);

  // Búsqueda de reservas.
  const search = usePaginatedSearch({
    defaultFilters: EMPLOYEE_RESERVATION_DEFAULT_FILTERS,
    buildCriteria: buildReservationSearchCriteria,
    fetch: fetchReservations,
    defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    errorMessage: MESSAGES.ERROR_LOADING_DATA
  });

  // Estado y callbacks para la búsqueda de reservas.
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

  // Formulario de creación de reserva.
  const createForm = useFormState({
    initialData: EMPLOYEE_RESERVATION_FORM_INITIAL_DATA,
    mapData: mapReservationToFormData
  });
  // Formulario de edición de reserva.
  const editForm = useFormState({
    initialData: EMPLOYEE_RESERVATION_FORM_INITIAL_DATA,
    mapData: mapReservationToFormData
  });

  // Estado de la página.
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

  // Identificador del empleado.
  const employeeId = useMemo(() => (
    user?.employeeId ?? ''
  ), [user]);

  // Carga los metadatos de la página.
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
        setVehicles(getResultsList(response));
      } else {
        setVehicles([]);
      }

      if (statusesResult.status === 'fulfilled') {
        setStatuses(normalizeReservationStatuses(statusesResult.value || [], locale));
      } else {
        setStatuses([]);
      }
    };

    loadMetadata().catch(() => {});
  }, [locale]);

  // Manejador de cambio de formulario de creación/edición (reutiliza utilidad compartida).
  const handleCreateChange = useCallback(
    (event) => handleFormChangeAndClearError(createForm, setCreateErrors, event),
    [createForm]
  );
  const handleEditChange = useCallback(
    (event) => handleFormChangeAndClearError(editForm, setEditErrors, event),
    [editForm]
  );

  // Manejador de apertura de modal de creación.
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateOpen(true);
    createForm.setFormAlert(null);
    setCreateErrors({});
  }, [createForm]);

  // Manejador de cierre de modal de creación.
  const closeCreateModal = useCallback(() => {
    setIsCreateOpen(false);
    createForm.resetForm();
    setCreateErrors({});
  }, [createForm]);

  // Manejador de cierre de modal de edición.
  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
    setEditReservationId(null);
    setIsEditLoading(false);
    editForm.resetForm();
    setEditErrors({});
  }, [editForm]);

  // Manejador de creación de reserva.
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

    await withSubmitting(setIsSubmitting, () => createForm.setFormAlert(null), async () => {
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
      }
    });
  }, [createForm, employeeId, filters, loadReservations, pagination.pageNumber, token]);

  // Manejador de edición de reserva.
  const handleEditReservation = useCallback(async (reservationId) => {
    if (!reservationId) return;
    setIsEditOpen(true);
    setEditReservationId(reservationId);
    editForm.setFormAlert(null);

    const cachedReservation = reservations.find((item) => item.reservationId === reservationId);
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

  // Manejador de actualización de reserva.
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

    await withSubmitting(setIsSubmitting, () => editForm.setFormAlert(null), async () => {
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
      }
    });
  }, [editForm, editReservationId, employeeId, filters, loadReservations, pagination.pageNumber, token]);

  // Manejador de eliminación de reserva.
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

  const handleGeneratePickupCode = useCallback(async (reservationId) => {
    if (!reservationId || !token) return;
    setPageAlert(null);
    try {
      await ReservationService.generatePickupCode(reservationId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.PICKUP_CODE_GENERATED });
      await loadReservations({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err?.message || MESSAGES.PICKUP_CODE_GENERATE_ERROR
      });
    }
  }, [filters, loadReservations, pagination.pageNumber, token]);

  const filterFields = useMemo(
    () => buildReservationFilterFields({ statuses, headquarters }),
    [statuses, headquarters]
  );
  // Map de sedes por identificador.
  const headquartersById = useMemo(
    () => new Map((headquarters || []).map((hq) => [Number(hq.id), hq])),
    [headquarters]
  );
  const statusById = useMemo(
    () => new Map((statuses || []).map((s) => [Number(s.reservationStatusId), s])),
    [statuses]
  );

  // Estado y callbacks para la página.
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
    // UI para la página.
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
    // Acciones para la página.
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
      handleGeneratePickupCode,
      closeCreateModal,
      closeEditModal
    },
    options: {
      pagination,
      filterFields,
      headquartersById,
      statusById
    }
  };
}

export default useEmployeeReservationsPage;
