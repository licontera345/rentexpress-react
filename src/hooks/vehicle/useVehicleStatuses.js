import useAsyncList from '../core/useAsyncList';
import useLocale from '../core/useLocale';
import { VehicleStatusService } from '../../api/services/CatalogService';

/**
 * Hook de estados de vehículos. Respeta locale y opcionalmente isoCode.
 * Delega en useAsyncList (genérico).
 */
const useVehicleStatuses = (isoCode) => {
  const locale = useLocale();
  const resolvedIsoCode = isoCode ?? locale;
  const { data, loading, error } = useAsyncList(
    () => VehicleStatusService.getAll(resolvedIsoCode),
    [resolvedIsoCode],
    { emptyMessage: 'Error al cargar estados' }
  );
  return { statuses: data, loading, error };
};

export default useVehicleStatuses;
