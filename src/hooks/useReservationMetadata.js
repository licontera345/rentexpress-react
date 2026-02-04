import { useCallback, useEffect, useRef, useState } from 'react';
import ReservationStatusService from '../api/services/ReservationStatusService';
import VehicleService from '../api/services/VehicleService';
import { PAGINATION } from '../constants';
import { filterReservationStatusesByLocale } from '../config/reservationStatusUtils';
import useLocale from './useLocale';

/**
 * Hook de metadatos para formularios de reservas.
 * Carga vehículos y estados en paralelo, con control de montaje para evitar fugas.
 */
// Hook que carga datos auxiliares (vehículos y estados) para formularios de reservas.
const useReservationMetadata = ({ locale } = {}) => {
  const resolvedLocale = locale ?? useLocale();
  const [vehicles, setVehicles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // Marca el componente como montado para evitar setState después del unmount.
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadMetadata = useCallback(async () => {
    // Carga vehículos y estados en paralelo.
    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    const [vehiclesResult, statusesResult] = await Promise.allSettled([
      VehicleService.search({
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.MAX_PAGE_SIZE
      }),
      ReservationStatusService.getAll(resolvedLocale)
    ]);

    if (vehiclesResult.status === 'fulfilled') {
      const response = vehiclesResult.value;
      const results = response?.results || response || [];
      if (isMounted.current) {
        // Guarda lista de vehículos para selects.
        setVehicles(results);
      }
    } else if (isMounted.current) {
      setVehicles([]);
      setError(vehiclesResult.reason?.message || 'Error al cargar vehículos');
    }

    if (statusesResult.status === 'fulfilled') {
      const data = statusesResult.value;
      if (isMounted.current) {
        // Filtra estados por locale.
        setStatuses(filterReservationStatusesByLocale(data || [], resolvedLocale));
      }
    } else if (isMounted.current) {
      setStatuses([]);
      setError(statusesResult.reason?.message || 'Error al cargar estados');
    }

    if (isMounted.current) {
      setLoading(false);
    }
  }, [resolvedLocale]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  return {
    vehicles,
    statuses,
    loading,
    error,
    reload: loadMetadata
  };
};

export default useReservationMetadata;
