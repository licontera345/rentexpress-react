import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../api/services/ReservationService';
import useHeadquarters from './useHeadquarters';
import { useAuth } from './useAuth';
import { MESSAGES, RESERVATION_STATUS, ROUTES } from '../constants';
import {
  buildReservationPayload,
  normalizeDateInput,
  normalizeSelectValue,
  normalizeTimeInput,
  validateReservationForm
} from '../config/reservationFormUtils';

/**
 * Hook para el formulario de creación de reservas.
 * Administra valores iniciales, validación, envío y redirección post-creación.
 */
// Hook que administra el formulario de creación de reservas.
const useReservationCreateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTimeoutRef = useRef(null);

  const initialValues = useMemo(() => {
    // Extrae valores iniciales desde el estado de navegación.
    const state = location.state || {};
    return {
      vehicleId: normalizeSelectValue(state.vehicleId || state.vehicle?.vehicleId || ''),
      pickupHeadquartersId: normalizeSelectValue(state.pickupHeadquartersId || state.currentHeadquartersId || ''),
      returnHeadquartersId: normalizeSelectValue(state.returnHeadquartersId || ''),
      startDate: normalizeDateInput(state.startDate || state.pickupDate || ''),
      startTime: normalizeTimeInput(state.startTime || state.pickupTime || state.startDate || state.pickupDate || ''),
      endDate: normalizeDateInput(state.endDate || state.returnDate || ''),
      endTime: normalizeTimeInput(state.endTime || state.returnTime || state.endDate || state.returnDate || ''),
      dailyPrice: state.dailyPrice || state.vehicle?.dailyPrice || ''
    };
  }, [location.state]);

  const vehicleSummary = useMemo(() => {
    // Construye un resumen del vehículo para mostrar en el formulario.
    const state = location.state || {};
    const summary = state.vehicleSummary || state.vehicle || {};
    return {
      brand: summary.brand || state.brand || '',
      model: summary.model || state.model || '',
      licensePlate: summary.licensePlate || state.licensePlate || '',
      manufactureYear: summary.manufactureYear || summary.year || state.manufactureYear || state.year || '',
      currentMileage: summary.currentMileage || summary.mileage || state.currentMileage || state.mileage || ''
    };
  }, [location.state]);

  const [formData, setFormData] = useState(() => initialValues);

  useEffect(() => {
    // Sincroniza cambios en valores iniciales con el estado del formulario.
    setFormData(prev => Object.assign({}, prev, initialValues));
  }, [initialValues]);

  useEffect(() => () => {
    // Limpia timeout de redirección si el componente se desmonta.
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    // Actualiza el campo correspondiente y limpia errores relacionados.
    setFormData(prev => Object.assign({}, prev, {
      [name]: value
    }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      return Object.assign({}, prev, {
        [name]: null
      });
    });

    setStatusMessage('');
    setErrorMessage('');
  }, []);

  const handleSubmit = useCallback(async (event) => {
    // Valida, prepara payload y envía la reserva.
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const nextErrors = validateReservationForm(formData, {
      requireVehicleId: true
    });

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setErrorMessage(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    if (!token) {
      setErrorMessage(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    const userId = user?.userId || user?.id;
    if (!userId) {
      setErrorMessage(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    const employeeId = user?.employeeId || user?.employee?.employeeId || user?.employee?.id || 1;

    setIsSubmitting(true);
    try {
      const payload = {
        ...buildReservationPayload(formData, { employeeId }),
        reservationStatusId: RESERVATION_STATUS.PENDING_ID,
        userId
      };

      await ReservationService.create(payload);
      setStatusMessage(MESSAGES.RESERVATION_CREATED);
      redirectTimeoutRef.current = setTimeout(() => {
        navigate(ROUTES.MY_RESERVATIONS);
      }, 1400);
    } catch (error) {
      setErrorMessage(error?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate, token, user]);

  return {
    formData,
    fieldErrors,
    statusMessage,
    errorMessage,
    isSubmitting,
    headquarters,
    headquartersLoading,
    headquartersError,
    vehicleSummary,
    handleChange,
    handleSubmit
  };
};

export default useReservationCreateForm;
