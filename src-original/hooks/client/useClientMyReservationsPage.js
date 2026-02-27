import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import VehicleService from '../../api/services/VehicleService';
import { ReservationStatusService } from '../../api/services/CatalogService';
import { MESSAGES, PAGINATION } from '../../constants';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { resolveReservationErrorMessage } from '../../utils/form/apiFormUtils';
import {
  getReservationStatusCanonical,
  buildReservationPayload,
  mapReservationToFormData,
  validateReservationFormClientEdit
} from '../../utils/reservation/reservationUtils';
import { EMPLOYEE_RESERVATION_FORM_INITIAL_DATA } from '../../utils/reservation/reservationEmployeeUtils';
import { resolveUserId } from '../../utils/ui/uiUtils';
import { useAuth } from '../core/useAuth';
import useFormState from '../core/useFormState';
import useLocale from '../core/useLocale';
import useHeadquarters from '../location/useHeadquarters';
import { withSubmitting, startAsyncLoad, handleFormChangeAndClearError } from '../_internal/orchestratorUtils';

export function useClientMyReservationsPage() {
  const { user } = useAuth();
  const locale = useLocale();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();
  const userId = resolveUserId(user);

  const [reservations, setReservations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageAlert, setPageAlert] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editReservationId, setEditReservationId] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editForm = useFormState({
    initialData: EMPLOYEE_RESERVATION_FORM_INITIAL_DATA,
    mapData: mapReservationToFormData
  });

  useEffect(() => {
    let cancelled = false;
    const loadStatuses = async () => {
      try {
        const data = await ReservationStatusService.getAll(locale);
        if (!cancelled) setStatuses(getResultsList(data));
      } catch {
        if (!cancelled) setStatuses([]);
      }
    };
    loadStatuses();
    return () => { cancelled = true; };
  }, [locale]);

  const loadReservations = useCallback(async () => {
    if (!userId) {
      setReservations([]);
      setError(MESSAGES.LOGIN_REQUIRED);
      return;
    }
    startAsyncLoad(setLoading, setError);
    try {
      const result = await ReservationService.search({ userId });
      setReservations(getResultsList(result));
    } catch (err) {
      setReservations([]);
      setError(resolveReservationErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleDeleteReservation = useCallback(async (reservationId) => {
    if (!reservationId) return;
    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_RESERVATION);
    if (!confirmed) return;
    setPageAlert(null);
    try {
      await ReservationService.delete(reservationId);
      setPageAlert({ type: 'success', message: MESSAGES.RESERVATION_DELETED });
      await loadReservations();
    } catch (err) {
      setPageAlert({
        type: 'error',
        message: err?.response?.data?.message ?? err?.message ?? MESSAGES.ERROR_DELETING
      });
    }
  }, [loadReservations]);

  // Map de estados por id para saber si una reserva es cancelable (pendiente).
  const statusById = useMemo(
    () => new Map((statuses || []).map((s) => [Number(s.reservationStatusId), s])),
    [statuses]
  );

  const isPendingReservation = useCallback((reservation) => {
    const status = statusById.get(Number(reservation?.reservationStatusId));
    const canonical = getReservationStatusCanonical(status?.statusName || '');
    return canonical === 'pending';
  }, [statusById]);

  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
    setEditReservationId(null);
    setEditErrors({});
    editForm.resetForm();
  }, [editForm]);

  const handleEditReservation = useCallback(async (reservationId) => {
    const reservation = reservations.find(
      (r) => (r?.reservationId ?? r?.id) === reservationId
    );
    if (!reservation || !isPendingReservation(reservation)) return;
    setEditReservationId(reservationId);
    setIsEditOpen(true);
    setIsEditLoading(true);
    editForm.setFormAlert(null);
    try {
      if (vehicles.length === 0) {
        const vehiclesRes = await VehicleService.search({
          pageNumber: PAGINATION.DEFAULT_PAGE,
          pageSize: PAGINATION.MAX_PAGE_SIZE
        });
        setVehicles(getResultsList(vehiclesRes));
      }
      const fullReservation = await ReservationService.findById(reservationId);
      editForm.populateForm(fullReservation);
    } catch (err) {
      editForm.setFormAlert({
        type: 'error',
        message: err?.message ?? MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [reservations, isPendingReservation, vehicles.length, editForm]);

  const handleEditChange = useCallback(
    (e) => handleFormChangeAndClearError(editForm, setEditErrors, e),
    [editForm]
  );

  const handleUpdateReservation = useCallback(async (e) => {
    e.preventDefault();
    if (!userId || !editReservationId) return;
    const nextErrors = validateReservationFormClientEdit(editForm.formData);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: 'error', message: MESSAGES.REQUIRED_FIELDS });
      return;
    }
    await withSubmitting(setIsSubmitting, () => editForm.setFormAlert(null), async () => {
      try {
        const payload = buildReservationPayload(editForm.formData);
        await ReservationService.update(editReservationId, payload);
        editForm.setFormAlert({ type: 'success', message: MESSAGES.RESERVATION_UPDATED });
        await loadReservations();
        closeEditModal();
      } catch (err) {
        editForm.setFormAlert({
          type: 'error',
          message: err?.response?.data?.message ?? err?.message ?? MESSAGES.ERROR_UPDATING
        });
      }
    });
  }, [userId, editReservationId, editForm, loadReservations, closeEditModal]);

  return {
    state: {
      reservations,
      headquarters,
      statuses,
      vehicles,
      editForm: editForm.formData,
      editErrors,
      editFormAlert: editForm.formAlert
    },
    ui: {
      isLoading: loading,
      error,
      pageAlert,
      isEditOpen,
      isEditLoading,
      isSubmitting,
      headquartersLoading,
      headquartersError
    },
    actions: {
      reload: loadReservations,
      handleDeleteReservation,
      setPageAlert,
      handleEditReservation,
      handleEditChange,
      handleUpdateReservation,
      closeEditModal,
      clearEditFormAlert: () => editForm.setFormAlert(null)
    },
    options: { hasReservations: reservations.length > 0, isPendingReservation },
  };
}
