import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../../api/services/ReservationService';
import VehicleService from '../../api/services/VehicleService';
import useHeadquarters from '../location/useHeadquarters';
import { useAuth } from '../core/useAuth';
import { MESSAGES, OPENWEATHER_API_KEY, RESERVATION_STATUS, ROUTES } from '../../constants';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useWeatherPreview from '../misc/useWeatherPreview';
import {
  buildReservationPayload,
  getReservationCreateInitialValues,
  getReservationVehicleSummaryFromLocation,
  validateReservationForm
} from '../../utils/reservationFormUtils';
import { filterVehiclesBySearchTerm } from '../../utils/vehicleUtils';
import { findHeadquartersById, getHeadquartersLabel } from '../../utils/headquartersUtils';
import {
  buildVehicleDetails,
  calculateDurationDays,
  calculateReservationTotal,
  getWeatherCityFromHeadquarters,
  isVehicleSelected
} from '../../utils/reservationSummaryUtils';
import { buildWeatherIconUrl, buildWeatherStats } from '../../utils/weatherUtils';
import { buildVehicleTitle } from '../../utils/vehicleUtils';
import { formatCurrency } from '../../utils/formatters';

/**
 * Hook para la página de creación de reservas (cliente).
 * Administra el formulario (valores iniciales, validación, sedes, vehículos),
 * el resumen con previsión meteorológica y el envío con redirección a "Mis reservas".
 */
const useClientReservationCreatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();
  useVehicleStatuses(); // Se mantiene para precargar cache/estado si aplica, sin reglas de negocio en UI.
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

  // Obtiene el formulario de reserva.
  const [formData, setFormData] = useState(() => initialValues);
  // Obtiene el resumen del vehículo seleccionado.
  const [selectedVehicleSummary, setSelectedVehicleSummary] = useState(() => vehicleSummary);

  useEffect(() => {
    // Sincroniza cambios en valores iniciales con el estado del formulario.
    setFormData(prev => Object.assign({}, prev, initialValues));
  }, [initialValues]);

  // Sincroniza los cambios en el resumen del vehículo seleccionado.
  useEffect(() => {
    setSelectedVehicleSummary(vehicleSummary);
  }, [vehicleSummary]);

  // Carga las opciones de vehículo.
  const loadVehicleOptions = useCallback(async () => {
    setVehicleSearchLoading(true);
    setVehicleSearchError('');
    // Busca las opciones de vehículo.
    try {
      const result = await VehicleService.search({
        pageNumber: 1,
        pageSize: 80
      });
      // Actualiza las opciones de vehículo.
      setVehicleOptions(result?.results || []);
    } catch (error) {
      setVehicleOptions([]);
      setVehicleSearchError(error?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setVehicleSearchLoading(false);
    }
  }, []);

  // Carga las opciones de vehículo.
  useEffect(() => {
    loadVehicleOptions().catch(() => {});
  }, [loadVehicleOptions]);

  useEffect(() => () => {
    // Limpia timeout de redirección si el componente se desmonta.
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  // Maneja el cambio en el formulario.
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    // Actualiza el campo correspondiente y limpia errores relacionados.
    setFormData(prev => Object.assign({}, prev, {
      [name]: value
    }));

    // Limpia los errores relacionados.
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

    // Si hay errores, actualiza los errores y muestra un mensaje de error.
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setErrorMessage(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    // Si no hay token, muestra un mensaje de error.
    if (!token) {
      setErrorMessage(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    // Si no hay usuario, muestra un mensaje de error.
    const userId = user?.userId;
    if (!userId) {
      setErrorMessage(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    const employeeId = user?.employeeId ?? null;

    // Inicia el estado de envío.
    setIsSubmitting(true);
    try {
      const payload = {
        ...buildReservationPayload(formData, { employeeId }),
        reservationStatusId: RESERVATION_STATUS.PENDING_ID,
        userId
      };

      // Crea la reserva.
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

  // Maneja el cambio en el término de búsqueda de vehículo.
  const handleVehicleSearchTermChange = useCallback((event) => {
    setVehicleSearchTerm(event.target.value || '');
  }, []);

  const handleVehicleSelect = useCallback((vehicle) => {
    if (!vehicle?.vehicleId) return;

    setFormData((prev) => Object.assign({}, prev, {
      vehicleId: String(vehicle.vehicleId),
      dailyPrice: vehicle.dailyPrice ?? ''
    }));

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
  // Obtiene la sede de devolución.
  const returnHeadquarters = useMemo(
    () => findHeadquartersById(headquarters, formData.returnHeadquartersId),
    [headquarters, formData.returnHeadquartersId]
  );
  // Obtiene la ciudad del clima.
  const weatherCity = useMemo(
    () => getWeatherCityFromHeadquarters(pickupHeadquarters, returnHeadquarters),
    [pickupHeadquarters, returnHeadquarters]
  );
  // Obtiene la previsión del clima.
  const weatherPreview = useWeatherPreview({
    city: weatherCity,
    apiKey: OPENWEATHER_API_KEY
  });

  // Obtiene el resumen de la reserva.
  const summaryView = useMemo(() => {
    const pickupLabel = getHeadquartersLabel(pickupHeadquarters);
    const returnLabel = getHeadquartersLabel(returnHeadquarters);
    // Obtiene el título del vehículo.
    const vehicleTitle = buildVehicleTitle(selectedVehicleSummary, {
      fallback: MESSAGES.RESERVATION_SUMMARY_VEHICLE_FALLBACK
    });
    // Obtiene los detalles del vehículo.
    const vehicleDetails = buildVehicleDetails({
      plate: selectedVehicleSummary?.licensePlate,
      year: selectedVehicleSummary?.manufactureYear,
      mileage: selectedVehicleSummary?.currentMileage
    });
    const dailyPrice = formatCurrency(formData.dailyPrice);
    const durationDays = calculateDurationDays(
      formData.startDate,
      formData.startTime,
      formData.endDate,
      formData.endTime
    );
    // Calcula el total estimado de la reserva.
    const totalEstimate = calculateReservationTotal(formData.dailyPrice, durationDays);
    // Devuelve el resumen de la reserva.
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
        weatherStats: buildWeatherStats(weatherPreview.weather)
      }
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
    weatherPreview
  ]);

  // Filtra las opciones de vehículo con el vehículo seleccionado.
  const vehicleOptionsWithSelection = useMemo(
    () =>
      filteredVehicleOptions.map((v) => ({
        ...v,
        selected: isVehicleSelected(v.vehicleId, formData.vehicleId)
      })),
    [filteredVehicleOptions, formData.vehicleId]
  );

  // Devuelve el estado de la página.
  return {
    // Estado de la página.
    state: {
      formData,
      fieldErrors,
      headquarters,
      vehicleSummary: selectedVehicleSummary,
      vehicleSearchTerm,
      vehicleOptions: vehicleOptionsWithSelection,
      summaryView
    },
    ui: {
      statusMessage,
      errorMessage,
      isSubmitting,
      headquartersLoading,
      headquartersError,
      vehicleSearchLoading,
      vehicleSearchError
    },
    actions: {
      handleChange,
      handleSubmit,
      handleVehicleSearchTermChange,
      handleVehicleSelect
    },
    meta: {}
  };
};

export default useClientReservationCreatePage;
