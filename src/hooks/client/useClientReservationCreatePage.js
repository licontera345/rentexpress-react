import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../../api/services/ReservationService';
import VehicleService from '../../api/services/VehicleService';
import { MESSAGES, OPENWEATHER_API_KEY, RESERVATION_STATUS, ROUTES } from '../../constants';
import {
  buildReservationPayload,
  getReservationCreateInitialValues,
  getReservationVehicleSummaryFromLocation,
  validateReservationForm,
  buildVehicleDetails,
  calculateDurationDays,
  calculateReservationTotal,
  getWeatherCityFromHeadquarters,
  isVehicleSelected,
} from '../../utils/reservationUtils';
import { filterVehiclesBySearchTerm, buildVehicleTitle } from '../../utils/vehicleUtils';
import { findHeadquartersById, getHeadquartersLabel } from '../../utils/headquartersUtils';
import { buildWeatherIconUrl, buildWeatherStats } from '../../utils/weatherUtils';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useWeatherPreview from '../misc/useWeatherPreview';

export function useClientReservationCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();
  useVehicleStatuses();
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState('');
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [vehicleSearchLoading, setVehicleSearchLoading] = useState(false);
  const [vehicleSearchError, setVehicleSearchError] = useState('');
  const redirectTimeoutRef = useRef(null);

  const initialValues = useMemo(
    () => getReservationCreateInitialValues(location.state),
    [location.state]
  );
  const vehicleSummary = useMemo(
    () => getReservationVehicleSummaryFromLocation(location.state),
    [location.state]
  );
  const [formData, setFormData] = useState(() => initialValues);
  const [selectedVehicleSummary, setSelectedVehicleSummary] = useState(() => vehicleSummary);

  useEffect(() => {
    setFormData((prev) => Object.assign({}, prev, initialValues));
  }, [initialValues]);
  useEffect(() => {
    setSelectedVehicleSummary(vehicleSummary);
  }, [vehicleSummary]);

  const loadVehicleOptions = useCallback(async () => {
    setVehicleSearchLoading(true);
    setVehicleSearchError('');
    try {
      const result = await VehicleService.search({ pageNumber: 1, pageSize: 80 });
      setVehicleOptions(result?.results || []);
    } catch (error) {
      setVehicleOptions([]);
      setVehicleSearchError(error?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setVehicleSearchLoading(false);
    }
  }, []);
  useEffect(() => {
    loadVehicleOptions().catch(() => {});
  }, [loadVehicleOptions]);
  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    },
    []
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => Object.assign({}, prev, { [name]: value }));
    setFieldErrors((prev) => (prev[name] ? Object.assign({}, prev, { [name]: null }) : prev));
    setStatusMessage('');
    setErrorMessage('');
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setErrorMessage('');
      setStatusMessage('');
      const nextErrors = validateReservationForm(formData, { requireVehicleId: true });
      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        setErrorMessage(MESSAGES.REQUIRED_FIELDS);
        return;
      }
      if (!token || !user?.userId) {
        setErrorMessage(MESSAGES.LOGIN_REQUIRED);
        return;
      }
      const userId = user.userId;
      const employeeId = user?.employeeId ?? null;
      setIsSubmitting(true);
      try {
        const payload = {
          ...buildReservationPayload(formData, { employeeId }),
          reservationStatusId: RESERVATION_STATUS.PENDING_ID,
          userId,
        };
        await ReservationService.create(payload);
        setStatusMessage(MESSAGES.RESERVATION_CREATED);
        redirectTimeoutRef.current = setTimeout(() => navigate(ROUTES.MY_RESERVATIONS), 1400);
      } catch (error) {
        setErrorMessage(error?.message || MESSAGES.UNEXPECTED_ERROR);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate, token, user]
  );

  const handleVehicleSearchTermChange = useCallback((event) => {
    setVehicleSearchTerm(event.target.value || '');
  }, []);

  const handleVehicleSelect = useCallback((vehicle) => {
    if (!vehicle?.vehicleId) return;
    setFormData((prev) =>
      Object.assign({}, prev, {
        vehicleId: String(vehicle.vehicleId),
        dailyPrice: vehicle.dailyPrice ?? '',
      })
    );
    setSelectedVehicleSummary(getReservationVehicleSummaryFromLocation({ vehicle }));
  }, []);

  const filteredVehicleOptions = useMemo(
    () => filterVehiclesBySearchTerm(vehicleOptions, vehicleSearchTerm),
    [vehicleOptions, vehicleSearchTerm]
  );
  const pickupHeadquarters = useMemo(
    () => findHeadquartersById(headquarters, formData.pickupHeadquartersId),
    [headquarters, formData.pickupHeadquartersId]
  );
  const returnHeadquarters = useMemo(
    () => findHeadquartersById(headquarters, formData.returnHeadquartersId),
    [headquarters, formData.returnHeadquartersId]
  );
  const weatherCity = useMemo(
    () => getWeatherCityFromHeadquarters(pickupHeadquarters, returnHeadquarters),
    [pickupHeadquarters, returnHeadquarters]
  );
  const weatherPreview = useWeatherPreview({ city: weatherCity, apiKey: OPENWEATHER_API_KEY });

  const summaryView = useMemo(() => {
    const pickupLabel = getHeadquartersLabel(pickupHeadquarters);
    const returnLabel = getHeadquartersLabel(returnHeadquarters);
    const vehicleTitle = buildVehicleTitle(selectedVehicleSummary, {
      fallback: MESSAGES.RESERVATION_SUMMARY_VEHICLE_FALLBACK,
    });
    const vehicleDetails = buildVehicleDetails({
      plate: selectedVehicleSummary?.licensePlate,
      year: selectedVehicleSummary?.manufactureYear,
      mileage: selectedVehicleSummary?.currentMileage,
    });
    const dailyPrice = formatCurrency(formData.dailyPrice);
    const durationDays = calculateDurationDays(
      formData.startDate,
      formData.startTime,
      formData.endDate,
      formData.endTime
    );
    const totalEstimate = calculateReservationTotal(formData.dailyPrice, durationDays);
    return {
      pickupLabel,
      returnLabel,
      vehicleTitle,
      vehicleDetails,
      dailyPrice,
      durationDays,
      totalEstimate,
      weatherCity,
      weatherPreview: {
        weather: weatherPreview.weather,
        loading: weatherPreview.loading,
        error: weatherPreview.error,
        canFetch: weatherPreview.canFetch,
        helperMessage: weatherPreview.helperMessage,
        fetchWeather: weatherPreview.fetchWeather,
        weatherIcon: buildWeatherIconUrl(weatherPreview.weather?.icon),
        weatherCondition: weatherPreview.weather?.condition || 'neutral',
        weatherStats: buildWeatherStats(weatherPreview.weather),
      },
    };
  }, [
    pickupHeadquarters,
    returnHeadquarters,
    selectedVehicleSummary,
    formData.dailyPrice,
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime,
    weatherCity,
    weatherPreview,
  ]);

  const vehicleOptionsWithSelection = useMemo(
    () =>
      filteredVehicleOptions.map((v) => ({
        ...v,
        selected: isVehicleSelected(v.vehicleId, formData.vehicleId),
      })),
    [filteredVehicleOptions, formData.vehicleId]
  );

  return {
    state: {
      formData,
      fieldErrors,
      headquarters,
      vehicleSummary: selectedVehicleSummary,
      vehicleSearchTerm,
      vehicleOptions: vehicleOptionsWithSelection,
      summaryView,
    },
    ui: {
      statusMessage,
      errorMessage,
      isSubmitting,
      headquartersLoading,
      headquartersError,
      vehicleSearchLoading,
      vehicleSearchError,
    },
    actions: {
      handleChange,
      handleSubmit,
      handleVehicleSearchTermChange,
      handleVehicleSelect,
    },
    meta: {},
  };
}
