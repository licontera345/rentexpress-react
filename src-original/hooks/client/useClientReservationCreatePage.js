import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../../api/services/ReservationService';
import VehicleService from '../../api/services/VehicleService';
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

// Hook para la página de creación de reservas del cliente.
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
  // Estimado desde el backend (regla de negocio en API/middleware); null si no disponible o fallback a cálculo local.
  const [estimateFromApi, setEstimateFromApi] = useState(null);

  // Obtiene los valores iniciales del formulario.
  const initialValues = useMemo(
    () => getReservationCreateInitialValues(location.state),
    [location.state]
  );
  const vehicleSummary = useMemo(
    () => getReservationVehicleSummaryFromLocation(location.state),
    [location.state]
  );
  // Estado del formulario.
  const [formData, setFormData] = useState(() => initialValues);
  const [selectedVehicleSummary, setSelectedVehicleSummary] = useState(() => vehicleSummary);

  // Actualiza el formulario con los valores iniciales.
  useEffect(() => {
    setFormData((prev) => Object.assign({}, prev, initialValues));
  }, [initialValues]);
  // Actualiza el resumen del vehículo.
  useEffect(() => {
    setSelectedVehicleSummary(vehicleSummary);
  }, [vehicleSummary]);

  // Carga las opciones de vehículo para la sede de recogida; si se pasan fechas, solo se muestran vehículos disponibles en ese rango.
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
    []
  );

  // Carga vehículos cuando cambia la sede o las fechas; con fechas solo se listan vehículos disponibles en ese rango.
  useEffect(() => {
    const pickupId = formData.pickupHeadquartersId ? String(formData.pickupHeadquartersId).trim() : null;
    setVehicleSearchTerm('');
    setFormData((prev) => Object.assign({}, prev, { vehicleId: '', dailyPrice: '' }));
    setSelectedVehicleSummary(null);
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
    loadVehicleOptions,
  ]);
  // Limpia el timeout de redirección al desmontar.
  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    },
    []
  );

  // Manejador de cambio de formulario.
  const handleChange = useCallback((event) => {
    const { name, value } = getInputValueFromEvent(event);
    setFormData((prev) => Object.assign({}, prev, { [name]: value }));
    clearFieldError(setFieldErrors, name);
    setStatusMessage('');
    setErrorMessage('');
  }, []);

  // Manejador de envío de formulario.
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
          setErrorMessage(
            error?.status === 409 ? MESSAGES.RESERVATION_VEHICLE_NOT_AVAILABLE : (error?.message || MESSAGES.UNEXPECTED_ERROR)
          );
        }
      });
    },
    [formData, navigate, token, user]
  );

  // Manejador de cambio de término de búsqueda de vehículo.
  const handleVehicleSearchTermChange = useCallback((event) => {
    setVehicleSearchTerm(event.target.value || '');
  }, []);

  // Manejador de selección de vehículo.
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

  // Filtra las opciones de vehículo.
  const filteredVehicleOptions = useMemo( 
    () => filterVehiclesBySearchTerm(vehicleOptions, vehicleSearchTerm),
    [vehicleOptions, vehicleSearchTerm]
  );
  // Obtiene la sede de recogida.
  const pickupHeadquarters = useMemo(
    () => findHeadquartersById(headquarters, formData.pickupHeadquartersId),
    [headquarters, formData.pickupHeadquartersId]
  );
  // Obtiene la sede de entrega.
  const returnHeadquarters = useMemo(
    () => findHeadquartersById(headquarters, formData.returnHeadquartersId),
    [headquarters, formData.returnHeadquartersId]
  );
  // Obtiene las ciudades del clima para ambas sedes.
  const pickupCity = useMemo(
    () => getHeadquartersCityName(pickupHeadquarters),
    [pickupHeadquarters]
  );
  const returnCity = useMemo(
    () => getHeadquartersCityName(returnHeadquarters),
    [returnHeadquarters]
  );
  const isSameCity = pickupCity && returnCity && pickupCity.toLowerCase() === returnCity.toLowerCase();
  const pickupWeather = useWeatherPreview({ city: pickupCity });
  const returnWeather = useWeatherPreview({ city: isSameCity ? null : returnCity });

  // Obtiene el estimado desde el backend cuando hay precio y fechas; evita duplicar la regla de negocio en el frontend.
  useEffect(() => {
    const dailyPrice = formData.dailyPrice != null && formData.dailyPrice !== '' ? Number(formData.dailyPrice) : null;
    const startIso = toReservationDateTime(formData.startDate, formData.startTime);
    const endIso = toReservationDateTime(formData.endDate, formData.endTime);
    if (!dailyPrice || !Number.isFinite(dailyPrice) || !startIso || !endIso) {
      setEstimateFromApi(null);
      return;
    }
    ReservationService.getEstimate(dailyPrice, startIso, endIso)
      .then((data) => setEstimateFromApi(data))
      .catch(() => setEstimateFromApi(null));
  }, [formData.dailyPrice, formData.startDate, formData.startTime, formData.endDate, formData.endTime]);

  // Obtiene el resumen de la reserva.
  const summaryView = useMemo(() => {
    // Obtiene el label de la sede de recogida.
    const pickupLabel = getHeadquartersLabel(pickupHeadquarters);
    // Obtiene el label de la sede de entrega.
    const returnLabel = getHeadquartersLabel(returnHeadquarters);
    // Obtiene el título del vehículo.
    const vehicleTitle = buildVehicleTitle(selectedVehicleSummary, {
      fallback: MESSAGES.RESERVATION_SUMMARY_VEHICLE_FALLBACK,
    });
    // Obtiene los detalles del vehículo.
    const vehicleDetails = buildVehicleDetails({
      plate: selectedVehicleSummary?.licensePlate,
      year: selectedVehicleSummary?.manufactureYear,
      mileage: selectedVehicleSummary?.currentMileage,
    });
    // Obtiene el precio diario.
    const dailyPrice = formatCurrency(formData.dailyPrice);
    // Días y total: desde el backend si está disponible; si no, fallback a cálculo local (UX).
    const durationDays =
      estimateFromApi?.durationDays ??
      calculateDurationDays(
        formData.startDate,
        formData.startTime,
        formData.endDate,
        formData.endTime
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

  // Obtiene las opciones de vehículo con selección.
  const vehicleOptionsWithSelection = useMemo(
    () =>
      filteredVehicleOptions.map((v) => ({
        ...v,
        selected: isVehicleSelected(v.vehicleId, formData.vehicleId),
      })),
    [filteredVehicleOptions, formData.vehicleId]
  );

  // El buscador de vehículos solo está disponible cuando hay sede de recogida seleccionada.
  const pickupLocationSelected = Boolean(
    formData.pickupHeadquartersId && String(formData.pickupHeadquartersId).trim()
  );

  // Estado y callbacks para el hook.
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
