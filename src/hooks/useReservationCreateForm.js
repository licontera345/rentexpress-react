import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../api/services/ReservationService';
import useHeadquarters from './useHeadquarters';
import { useAuth } from './useAuth';
import { MESSAGES, RESERVATION_STATUS, ROUTES } from '../constants';

const normalizeDateInput = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';
    if (trimmedValue.includes('T')) {
      return trimmedValue.split('T')[0];
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
      return trimmedValue;
    }
    const parsed = new Date(trimmedValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  return '';
};

const normalizeSelectValue = (value) => {
  if (value === null || value === undefined) return '';
  if (value === 0) return '0';
  return String(value);
};

const normalizeTimeInput = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(11, 16);
  }
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';
    if (trimmedValue.includes('T')) {
      const timePart = trimmedValue.split('T')[1];
      if (timePart) return timePart.slice(0, 5);
    }
    if (/^\d{2}:\d{2}/.test(trimmedValue)) {
      return trimmedValue.slice(0, 5);
    }
    const parsed = new Date(trimmedValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(11, 16);
    }
  }
  return '';
};

const toReservationDateTime = (dateValue, timeValue) => {
  if (!dateValue) return dateValue;
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue;
  }
  const normalizedTime = timeValue && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00';
  return `${dateValue}T${normalizedTime}:00`;
};

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
    const state = location.state || {};
    return {
      vehicleId: normalizeSelectValue(state.vehicleId || state.vehicle?.vehicleId || ''),
      pickupHeadquartersId: normalizeSelectValue(state.pickupHeadquartersId || state.currentHeadquartersId || ''),
      returnHeadquartersId: normalizeSelectValue(state.returnHeadquartersId || ''),
      startDate: normalizeDateInput(state.startDate || state.pickupDate || ''),
      startTime: normalizeTimeInput(state.startDate || state.pickupDate || ''),
      endDate: normalizeDateInput(state.endDate || state.returnDate || ''),
      endTime: normalizeTimeInput(state.endDate || state.returnDate || ''),
      dailyPrice: state.dailyPrice || state.vehicle?.dailyPrice || ''
    };
  }, [location.state]);

  const [formData, setFormData] = useState(() => initialValues);

  useEffect(() => {
    setFormData(prev => Object.assign({}, prev, initialValues));
  }, [initialValues]);

  useEffect(() => () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
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
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const nextErrors = {};
    if (!formData.vehicleId) nextErrors.vehicleId = MESSAGES.FIELD_REQUIRED;
    if (!formData.pickupHeadquartersId) nextErrors.pickupHeadquartersId = MESSAGES.FIELD_REQUIRED;
    if (!formData.returnHeadquartersId) nextErrors.returnHeadquartersId = MESSAGES.FIELD_REQUIRED;
    if (!formData.startDate) nextErrors.startDate = MESSAGES.FIELD_REQUIRED;
    if (!formData.startTime) nextErrors.startTime = MESSAGES.FIELD_REQUIRED;
    if (!formData.endDate) nextErrors.endDate = MESSAGES.FIELD_REQUIRED;
    if (!formData.endTime) nextErrors.endTime = MESSAGES.FIELD_REQUIRED;

    const startDateValue = formData.startDate
      ? new Date(toReservationDateTime(formData.startDate, formData.startTime))
      : null;
    const endDateValue = formData.endDate
      ? new Date(toReservationDateTime(formData.endDate, formData.endTime))
      : null;

    if (startDateValue && endDateValue && endDateValue < startDateValue) {
      nextErrors.endDate = MESSAGES.RESERVATION_DATE_RANGE_INVALID;
    }

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
        vehicleId: Number(formData.vehicleId),
        pickupHeadquartersId: Number(formData.pickupHeadquartersId),
        returnHeadquartersId: Number(formData.returnHeadquartersId),
        startDate: toReservationDateTime(formData.startDate, formData.startTime),
        endDate: toReservationDateTime(formData.endDate, formData.endTime),
        reservationStatusId: RESERVATION_STATUS.PENDING_ID,
        userId,
        employeeId
      };

      await ReservationService.create(payload, token);
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
    handleChange,
    handleSubmit
  };
};

export default useReservationCreateForm;
