import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../../api/services/reservationService';
import VehicleService from '../../api/services/vehicleService';
import { MESSAGES, ROUTES } from '../../constants';
import {
  buildReservationPayload,
  getReservationCreateInitialValues,
  getReservationVehicleSummaryFromLocation,
  validateReservationForm,
  buildVehicleDetails,
  calculateDurationDays,
  calculateReservationTotal,
  isVehicleSelected,
  toReservationDateTime,
} from '../../utils/reservation/reservationUtils';
import { filterVehiclesBySearchTerm, buildVehicleTitle } from '../../utils/vehicle';
import { findHeadquartersById, getHeadquartersLabel } from '../../utils/location/headquartersUtils';
import { buildWeatherStats } from '../../utils/weather/weatherUtils';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { formatCurrency } from '../../utils/form/formatters';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useWeatherPreview from '../misc/useWeatherPreview';
import { getHeadquartersCityName } from '../../constants';
import { withSubmitting, getInputValueFromEvent, clearFieldError } from '../_internal/orchestratorUtils';
import { resolveUserId } from '../../utils/ui/uiUtils';

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
  const isInitialLoadFromCatalogRef = useRef(true);
  const previousPickupHeadquartersIdRef = useRef(null);
  const [estimateFromApi, setEstimateFromApi] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);

  const initialValues = useMemo(
    () => getReservationCreateInitialValues(location.state),
    [location.state],
  );
  const vehicleSummary = useMemo(
    () => getReservationVehicleSummaryFromLocation(location.state),
    [location.state],
  );
  const [formData, setFormData] = useState(() => initialValues);
  const [selectedVehicleSummary, setSelectedVehicleSummary] = useState(() => vehicleSummary);

  useEffect(() => {
    setFormData((prev) => Object.assign({}, prev, initialValues));
  }, [initialValues]);
  useEffect(() => {
    setSelectedVehicleSummary(vehicleSummary);
  }, [vehicleSummary]);

  const loadVehicleOptions = useCallback(
    async (headquartersId, availableFromIso, availableToIso) => {
      if (!headquartersId) {
        setVehicleOptions([]);
        return;
      }
      setVehicleSearchLoading(true);
      setVehicleSearchError('');
      try {
        const criteria = {
          currentHeadquartersId: Number(headquartersId),
          pageNumber: 1,
          pageSize: 80,
        };
        if (availableFromIso && availableToIso) {
          criteria.availableFrom = availableFromIso;
          criteria.availableTo = availableToIso;
        }
        const result = await VehicleService.search(criteria);
        setVehicleOptions(getResultsList(result));
      } catch (error) {
        setVehicleOptions([]);
        setVehicleSearchError(error?.message || MESSAGES.UNEXPECTED_ERROR);
      } finally {
        setVehicleSearchLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const pickupId = formData.pickupHeadquartersId ? String(formData.pickupHeadquartersId).trim() : null;
    setVehicleSearchTerm('');
    const isFromCatalog = isInitialLoadFromCatalogRef.current && initialValues.vehicleId && location.state?.vehicleId;
    const pickupChanged =
      previousPickupHeadquartersIdRef.current !== null &&
      previousPickupHeadquartersIdRef.current !== pickupId;
    const shouldClearVehicle = (!isFromCatalog && pickupChanged) || (isInitialLoadFromCatalogRef.current && !isFromCatalog);
    if (shouldClearVehicle) {
      setFormData((prev) => Object.assign({}, prev, { vehicleId: '', dailyPrice: '' }));
      setSelectedVehicleSummary(null);
    }
    isInitialLoadFromCatalogRef.current = false;
    previousPickupHeadquartersIdRef.current = pickupId;
    if (!pickupId) {
      setVehicleOptions([]);
      setVehicleSearchError('');
      return;
    }
    const startIso = toReservationDateTime(formData.startDate, formData.startTime);
    const endIso = toReservationDateTime(formData.endDate, formData.endTime);
    loadVehicleOptions(pickupId, startIso || undefined, endIso || undefined).catch(() => {});
  }, [
    formData.pickupHeadquartersId,
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime,
    initialValues.vehicleId,
    location.state?.vehicleId,
    loadVehicleOptions,
  ]);
  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    },
    [],
  );

  const handleChange = useCallback((event) => {
    const { name, value } = getInputValueFromEvent(event);
    setFormData((prev) => Object.assign({}, prev, { [name]: value }));
    clearFieldError(setFieldErrors, name);
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
      const userId = resolveUserId(user);
      if (!token || !userId) {
        setErrorMessage(MESSAGES.LOGIN_REQUIRED);
        return;
      }
      const employeeId = user?.employeeId ?? null;

      await withSubmitting(setIsSubmitting, null, async () => {
        try {
          const payload = {
            ...buildReservationPayload(formData, { employeeId }),
            userId,
          };
          await ReservationService.create(payload);
          setStatusMessage(MESSAGES.RESERVATION_CREATED);
          redirectTimeoutRef.current = setTimeout(() => navigate(ROUTES.MY_RESERVATIONS), 1400);
        } catch (error) {
          if (error?.fieldErrors && typeof error.fieldErrors === 'object' && Object.keys(error.fieldErrors).length > 0) {
            setFieldErrors(error.fieldErrors);
          }
          setErrorMessage(
            error?.status === 409 ? MESSAGES.RESERVATION_VEHICLE_NOT_AVAILABLE : (error?.message || MESSAGES.UNEXPECTED_ERROR),
          );
        }
      });
    },
    [formData, navigate, token, user],
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
    [vehicleOptions, vehicleSearchTerm],
  );
  const pickupHeadquarters = useMemo(
    () => findHeadquartersById(headquarters, formData.pickupHeadquartersId),
    [headquarters, formData.pickupHeadquartersId],
  );
  const returnHeadquarters = useMemo(
    () => findHeadquartersById(headquarters, formData.returnHeadquartersId),
    [headquarters, formData.returnHeadquartersId],
  );
  const pickupCity = useMemo(
    () => getHeadquartersCityName(pickupHeadquarters),
    [pickupHeadquarters],
  );
  const returnCity = useMemo(
    () => getHeadquartersCityName(returnHeadquarters),
    [returnHeadquarters],
  );
  const isSameCity = pickupCity && returnCity && pickupCity.toLowerCase() === returnCity.toLowerCase();
  const pickupWeather = useWeatherPreview({ city: pickupCity });
  const returnWeather = useWeatherPreview({ city: isSameCity ? null : returnCity });

  useEffect(() => {
    const dailyPrice = formData.dailyPrice != null && formData.dailyPrice !== '' ? Number(formData.dailyPrice) : null;
    const startIso = toReservationDateTime(formData.startDate, formData.startTime);
    const endIso = toReservationDateTime(formData.endDate, formData.endTime);
    if (!dailyPrice || !Number.isFinite(dailyPrice) || !startIso || !endIso) {
      setEstimateFromApi(null);
      setEstimateLoading(false);
      return;
    }
    setEstimateLoading(true);
    ReservationService.getEstimate(dailyPrice, startIso, endIso)
      .then((data) => setEstimateFromApi(data))
      .catch(() => setEstimateFromApi(null))
      .finally(() => setEstimateLoading(false));
  }, [formData.dailyPrice, formData.startDate, formData.startTime, formData.endDate, formData.endTime]);

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
    const durationDays =
      estimateFromApi?.durationDays ??
      calculateDurationDays(
        formData.startDate,
        formData.startTime,
        formData.endDate,
        formData.endTime,
      );
    const totalEstimate =
      estimateFromApi?.estimatedTotal != null
        ? formatCurrency(estimateFromApi.estimatedTotal)
        : calculateReservationTotal(formData.dailyPrice, durationDays);
    const buildWeatherBlock = (wp) => ({
      weather: wp.weather,
      loading: wp.loading,
      error: wp.error,
      canFetch: wp.canFetch,
      helperMessage: wp.helperMessage,
      fetchWeather: wp.fetchWeather,
      weatherEmoji: wp.weather?.emoji || '',
      weatherCondition: wp.weather?.condition || 'neutral',
      weatherStats: buildWeatherStats(wp.weather),
    });

    return {
      pickupLabel,
      returnLabel,
      vehicleTitle,
      vehicleDetails,
      dailyPrice,
      durationDays,
      totalEstimate,
      pickupCity,
      returnCity: isSameCity ? null : returnCity,
      pickupWeatherPreview: buildWeatherBlock(pickupWeather),
      returnWeatherPreview: isSameCity ? null : buildWeatherBlock(returnWeather),
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
    estimateFromApi,
    pickupCity,
    returnCity,
    isSameCity,
    pickupWeather,
    returnWeather,
  ]);

  const vehicleOptionsWithSelection = useMemo(
    () =>
      filteredVehicleOptions.map((v) => ({
        ...v,
        selected: isVehicleSelected(v.vehicleId, formData.vehicleId),
      })),
    [filteredVehicleOptions, formData.vehicleId],
  );

  const pickupLocationSelected = Boolean(
    formData.pickupHeadquartersId && String(formData.pickupHeadquartersId).trim(),
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
      pickupLocationSelected,
    },
    ui: {
      statusMessage,
      errorMessage,
      isSubmitting,
      headquartersLoading,
      headquartersError,
      vehicleSearchLoading,
      vehicleSearchError,
      estimateLoading,
    },
    actions: {
      handleChange,
      handleSubmit,
      handleVehicleSearchTermChange,
      handleVehicleSelect,
    },
    options: {},
  };
}
