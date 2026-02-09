import { useCallback, useMemo, useState } from 'react';
import ReservationService from '../api/services/ReservationService';
import { ALERT_VARIANTS, MESSAGES } from '../constants';
import { buildReservationPayload, validateReservationForm } from '../config/reservationFormUtils';
import { useAuth } from './useAuth';
import useEmployeeReservationsList from './useEmployeeReservationsList';
import useHeadquarters from './useHeadquarters';
import useReservationForm from './useReservationForm';
import useReservationMetadata from './useReservationMetadata';

const clearFieldError = (setErrors, name) => {
  setErrors((prev) => {
    if (!prev[name]) return prev;
    return Object.assign({}, prev, { [name]: null });
  });
};

const buildFormChangeHandler = (form, setErrors) => (event) => {
  form.handleFormChange(event);
  const { name } = event.target;
  clearFieldError(setErrors, name);
  form.setFormAlert(null);
};

function useEmployeeReservationsPage() {
  const { token, user } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();
  const {
    reservations,
    loading,
    error,
    filters,
    pagination,
    loadReservations,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange
  } = useEmployeeReservationsList();
  const createForm = useReservationForm();
  const editForm = useReservationForm();
  const { vehicles, statuses } = useReservationMetadata();
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

  const handleCreateChange = useCallback(buildFormChangeHandler(createForm, setCreateErrors), [createForm]);
  const handleEditChange = useCallback(buildFormChangeHandler(editForm, setEditErrors), [editForm]);

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
  }, [
    createForm,
    employeeId,
    filters,
    loadReservations,
    pagination.pageNumber,
    token
  ]);

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
  }, [
    editForm,
    editReservationId,
    employeeId,
    filters,
    loadReservations,
    pagination.pageNumber,
    token
  ]);

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
    headquarters,
    headquartersLoading,
    headquartersError,
    reservations,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
    vehicles,
    statuses,
    createForm,
    editForm,
    pageAlert,
    setPageAlert,
    isSubmitting,
    isCreateOpen,
    isEditOpen,
    isEditLoading,
    createErrors,
    editErrors,
    handleCreateChange,
    handleEditChange,
    handleOpenCreateModal,
    handleCreateReservation,
    handleEditReservation,
    handleUpdateReservation,
    handleDeleteReservation,
    closeCreateModal,
    closeEditModal
  };
}

export default useEmployeeReservationsPage;
