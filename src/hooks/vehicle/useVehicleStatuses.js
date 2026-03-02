import useLocale from '../core/useLocale';
import useCatalogList from '../core/useCatalogList';
import { VehicleStatusService } from '../../api/services/CatalogService';

const useVehicleStatuses = (isoCode) => {
  const locale = useLocale();
  const resolvedIsoCode = isoCode ?? locale;
  const { data: statuses, loading, error, dataById } = useCatalogList(
    () => VehicleStatusService.getAll(resolvedIsoCode),
    [resolvedIsoCode],
    { emptyMessage: 'Error al cargar estados', idKey: 'vehicleStatusId' }
  );
  return { statuses, loading, error, statusById: dataById };
};

export default useVehicleStatuses;
