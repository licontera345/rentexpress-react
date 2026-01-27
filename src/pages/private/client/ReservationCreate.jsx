import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import Button from '../../../components/common/actions/Button';
import ReservationService from '../../../api/services/ReservationService';
import useHeadquarters from '../../../hooks/useHeadquarters';
import { useAuth } from '../../../hooks/useAuth';
import { BUTTON_VARIANTS, MESSAGES, ROUTES } from '../../../constants';

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

const toReservationDateTime = (value) => {
  if (!value) return value;
  if (typeof value === 'string' && value.includes('T')) {
    return value;
  }
  return `${value}T00:00:00`;
};

function ReservationCreate() {
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
      endDate: normalizeDateInput(state.endDate || state.returnDate || ''),
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => Object.assign({}, prev, {
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => Object.assign({}, prev, {
        [name]: null
      }));
    }

    if (statusMessage) setStatusMessage('');
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const nextErrors = {};
    if (!formData.vehicleId) nextErrors.vehicleId = MESSAGES.FIELD_REQUIRED;
    if (!formData.pickupHeadquartersId) nextErrors.pickupHeadquartersId = MESSAGES.FIELD_REQUIRED;
    if (!formData.returnHeadquartersId) nextErrors.returnHeadquartersId = MESSAGES.FIELD_REQUIRED;
    if (!formData.startDate) nextErrors.startDate = MESSAGES.FIELD_REQUIRED;
    if (!formData.endDate) nextErrors.endDate = MESSAGES.FIELD_REQUIRED;

    const startDateValue = formData.startDate ? new Date(formData.startDate) : null;
    const endDateValue = formData.endDate ? new Date(formData.endDate) : null;

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

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId: Number(formData.vehicleId),
        pickupHeadquartersId: Number(formData.pickupHeadquartersId),
        returnHeadquartersId: Number(formData.returnHeadquartersId),
        startDate: toReservationDateTime(formData.startDate),
        endDate: toReservationDateTime(formData.endDate),
        userId
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

  const isVehicleLocked = Boolean(initialValues.vehicleId);

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.RESERVATION_CREATE_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.RESERVATION_CREATE_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card personal-space-card--profile">
          <form className="profile-form" onSubmit={handleSubmit}>
            <FormField
              label={MESSAGES.RESERVATION_VEHICLE_ID}
              type="number"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
              disabled={isSubmitting || isVehicleLocked}
              error={fieldErrors.vehicleId}
            />

            <FormField
              label={MESSAGES.PICKUP_LOCATION}
              name="pickupHeadquartersId"
              value={formData.pickupHeadquartersId}
              onChange={handleChange}
              required
              disabled={isSubmitting || headquartersLoading}
              error={fieldErrors.pickupHeadquartersId}
              as="select"
              helper={headquartersError || null}
            >
              <option value="">{MESSAGES.SELECT_LOCATION}</option>
              {headquarters.map((hq) => (
                <option key={hq.headquartersId || hq.id} value={hq.headquartersId || hq.id}>
                  {hq.headquartersName || hq.name}
                </option>
              ))}
            </FormField>

            <FormField
              label={MESSAGES.RETURN_LOCATION}
              name="returnHeadquartersId"
              value={formData.returnHeadquartersId}
              onChange={handleChange}
              required
              disabled={isSubmitting || headquartersLoading}
              error={fieldErrors.returnHeadquartersId}
              as="select"
              helper={headquartersError || null}
            >
              <option value="">{MESSAGES.SELECT_LOCATION}</option>
              {headquarters.map((hq) => (
                <option key={hq.headquartersId || hq.id} value={hq.headquartersId || hq.id}>
                  {hq.headquartersName || hq.name}
                </option>
              ))}
            </FormField>

            <FormField
              label={MESSAGES.PICKUP_DATE}
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              error={fieldErrors.startDate}
            />

            <FormField
              label={MESSAGES.RETURN_DATE}
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              error={fieldErrors.endDate}
            />

            {formData.dailyPrice && (
              <FormField
                label={MESSAGES.DAILY_PRICE}
                type="number"
                name="dailyPrice"
                value={formData.dailyPrice}
                onChange={handleChange}
                disabled
              />
            )}

            {errorMessage && (
              <p className="profile-alert profile-alert--error" role="alert">
                {errorMessage}
              </p>
            )}

            {statusMessage && (
              <p className="profile-alert profile-alert--success" role="status">
                {statusMessage}
              </p>
            )}

            <div className="profile-form-actions">
              <Button
                type="submit"
                variant={BUTTON_VARIANTS.PRIMARY}
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? MESSAGES.STARTING : MESSAGES.RESERVE}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default ReservationCreate;
