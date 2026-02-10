import { useEffect, useState } from 'react';
import VehicleStatusService from '../../api/services/VehicleStatusService';
import useLocale from '../core/useLocale';

/**
 * Hook de estados de vehículos.
 * Permite forzar el idioma vía isoCode y actualiza el catálogo cuando cambia.
 */
const useVehicleStatuses = (isoCode) => {
  const locale = useLocale();
  const resolvedIsoCode = isoCode ?? locale;
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const data = await VehicleStatusService.getAll(resolvedIsoCode);
        setStatuses(data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar estados');
        setStatuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [resolvedIsoCode]);

  return {
    statuses,
    loading,
    error
  };
};

export default useVehicleStatuses;
