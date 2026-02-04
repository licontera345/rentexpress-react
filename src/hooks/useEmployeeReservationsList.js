import { useCallback, useEffect, useState } from 'react';
import ReservationService from '../api/services/ReservationService';
import { MESSAGES, PAGINATION } from '../constants';
import useLocale from './useLocale';
import {
  enrichReservations,
  normalizeReservationResults,
  resolveReservationErrorMessage
} from '../config/reservationData';

/**
 * Hook del panel de empleados para administrar reservas.
 * Encapsula filtros, paginación, carga remota y enriquecimiento de datos.
 */
// Filtros por defecto para la búsqueda de reservas en el panel de empleados.
const DEFAULT_FILTERS = {
  reservationId: '',
  vehicleId: '',
  userId: '',
  reservationStatusId: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  startDateFrom: '',
  startDateTo: '',
  endDateFrom: '',
  endDateTo: ''
};

// Hook que gestiona la tabla de reservas (filtros, paginación y carga).
const useEmployeeReservationsList = () => {
  const locale = useLocale();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState({
    pageNumber: PAGINATION.DEFAULT_PAGE,
    totalPages: PAGINATION.DEFAULT_PAGE,
    totalRecords: 0
  });

  const loadReservations = useCallback(async ({
    nextFilters = DEFAULT_FILTERS,
    pageNumber = PAGINATION.DEFAULT_PAGE
  } = {}) => {
    // Ejecuta la búsqueda con filtros y paginación.
    setLoading(true);
    setError(null);

    try {
      const response = await ReservationService.search({
        reservationId: nextFilters.reservationId || undefined,
        vehicleId: nextFilters.vehicleId || undefined,
        userId: nextFilters.userId || undefined,
        reservationStatusId: nextFilters.reservationStatusId || undefined,
        pickupHeadquartersId: nextFilters.pickupHeadquartersId || undefined,
        returnHeadquartersId: nextFilters.returnHeadquartersId || undefined,
        startDateFrom: nextFilters.startDateFrom || undefined,
        startDateTo: nextFilters.startDateTo || undefined,
        endDateFrom: nextFilters.endDateFrom || undefined,
        endDateTo: nextFilters.endDateTo || undefined,
        pageNumber,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });
      const results = normalizeReservationResults(response);
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / PAGINATION.DEFAULT_PAGE_SIZE));
      const hydratedReservations = await enrichReservations(results, {
        canFetchStatuses: true,
        isoCode: locale
      });

      // Normaliza la respuesta y actualiza el estado de la tabla.
      setReservations(hydratedReservations);
      setPagination({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      });
    } catch (err) {
      setError(resolveReservationErrorMessage(err) || MESSAGES.ERROR_LOADING_DATA);
      setReservations([]);
      setPagination({
        pageNumber: PAGINATION.DEFAULT_PAGE,
        totalPages: PAGINATION.DEFAULT_PAGE,
        totalRecords: 0
      });
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    // Carga inicial con filtros por defecto.
    loadReservations({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadReservations]);

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    // Sincroniza inputs del formulario con el estado local.
    setFilters((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(() => {
    // Aplica los filtros actuales y reinicia la paginación.
    loadReservations({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadReservations]);

  const resetFilters = useCallback(() => {
    // Restablece filtros y vuelve a la primera página.
    setFilters(DEFAULT_FILTERS);
    loadReservations({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadReservations]);

  const handlePageChange = useCallback((nextPage) => {
    // Navega entre páginas manteniendo los filtros.
    loadReservations({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadReservations]);

  return {
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
  };
};

export default useEmployeeReservationsList;
