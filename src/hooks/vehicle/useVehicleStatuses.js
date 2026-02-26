import useAsyncList from '../core/useAsyncList';
import useLocale from '../core/useLocale';
import { VehicleStatusService } from '../../api/services/CatalogService';

const useVehicleStatuses = (isoCode) => {
  const locale = useLocale();
  const resolvedIsoCode = isoCode ?? locale;
  const { data, loading, error } = useAsyncList(
    () => VehicleStatusService.getAll(resolvedIsoCode),
    [resolvedIsoCode],
    { emptyMessage: 'Error al cargar estados' }
  );
  // Estado y callbacks para el hook.
  return { statuses: data, loading, error };
};

export default useVehicleStatuses;
