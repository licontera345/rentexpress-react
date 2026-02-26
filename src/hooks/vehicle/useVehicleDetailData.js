import { useMemo } from 'react';
import useVehicleDetail from './useVehicleDetail';
import useVehicleCategories from './useVehicleCategories';
import useHeadquarters from '../location/useHeadquarters';
import useVehicleStatuses from './useVehicleStatuses';
import useVehicleImage from './useVehicleImage';
import { formatVehicleForDetail } from '../../utils/vehicle';

function useVehicleDetailData(vehicleId) {
  const { vehicle, loading, error } = useVehicleDetail(vehicleId);
  const { categoryMap } = useVehicleCategories();
  const { headquartersMap } = useHeadquarters();
  const { statuses } = useVehicleStatuses();
  const { imageSrc, hasImage } = useVehicleImage(vehicleId);

  const statusMap = useMemo(
    () => new Map(statuses.map((s) => [s.vehicleStatusId, s.statusName])),
    [statuses]
  );

  // Formatea el vehículo para el modal de detalle.
  const formattedVehicle = useMemo(
    () => (vehicle ? formatVehicleForDetail(vehicle, { categoryMap, headquartersMap, statusMap }) : null),
    [vehicle, categoryMap, headquartersMap, statusMap]
  );

  return {
    vehicle,
    formattedVehicle,
    loading,
    error,
    imageSrc,
    hasImage
  };
}

export default useVehicleDetailData;
