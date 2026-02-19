import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../../api/services/ReservationService';
import VehicleService from '../../api/services/VehicleService';
import { MESSAGES, RESERVATION_STATUS, ROUTES } from '../../constants';
import {
  buildReservationPayload,
  getReservationCreateInitialValues,
  getReservationVehicleSummaryFromLocation,
  validateReservationForm,
  buildVehicleDetails,
  calculateDurationDays,
  calculateReservationTotal,
  isVehicleSelected,
} from '../../utils/reservationUtils';
import { filterVehiclesBySearchTerm, buildVehicleTitle } from '../../utils/vehicleUtils';
import { findHeadquartersById, getHeadquartersLabel } from '../../utils/headquartersUtils';
import { buildWeatherStats } from '../../utils/weatherUtils';
import { getResultsList } from '../../utils/apiResponseUtils';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useWeatherPreview from '../misc/useWeatherPreview';
import { getHeadquartersCityName } from '../../constants';

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

  // Obtiene los valores iniciales del formulario.
  const initialValues = useMemo(
    () => getReservationCreateInitialValues(location.state),
    [location.state]
  );
  // Obtiene el resumen del vehículo.
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

  // Carga las opciones de vehículo.
  const loadVehicleOptions = useCallback(async () => {
    setVehicleSearchLoading(true);
    setVehicleSearchError('');
    try {
      const result = await VehicleService.search({ pageNumber: 1, pageSize: 80 });
      setVehicleOptions(getResultsList(result));
    } catch (error) {
      setVehicleOptions([]);
      setVehicleSearchError(error?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setVehicleSearchLoading(false);
    }
  }, []);
  // Carga las opciones de vehículo al montar.
  useEffect(() => {
    loadVehicleOptions().catch(() => {});
  }, [loadVehicleOptions]);
  // Limpia el timeout de redirección al desmontar.
  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    },
    []
  );

  // Manejador de cambio de formulario.
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => Object.assign({}, prev, { [name]: value }));
    setFieldErrors((prev) => (prev[name] ? Object.assign({}, prev, { [name]: null }) : prev));
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
      // Obtiene el identificador del usuario.
      const userId = user.userId;
      // Obtiene el identificador del empleado.
      const employeeId = user?.employeeId ?? null;
      // Establece el estado de envío.
      setIsSubmitting(true);
      try {
        // Construye el payload de la reserva.
        const payload = {
          ...buildReservationPayload(formData, { employeeId }),
          reservationStatusId: RESERVATION_STATUS.PENDING_ID,
          userId,
        };
        // Crea la reserva.
        await ReservationService.create(payload);
        // Establece el mensaje de estado.
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
    // Obtiene el número de días de la reserva.
    const durationDays = calculateDurationDays(
      formData.startDate,
      formData.startTime,
      formData.endDate,
      formData.endTime
    );
    // Obtiene el total estimado de la reserva.
    const totalEstimate = calculateReservationTotal(formData.dailyPrice, durationDays);
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
