import useFormState from '../core/useFormState';
import {
  DEFAULT_VEHICLE_FORM_DATA,
  mapVehicleToFormData,
  buildVehiclePayload
} from '../../utils/vehicleUtils';

export { DEFAULT_VEHICLE_FORM_DATA, mapVehicleToFormData, buildVehiclePayload };

/**
 * Hook de formulario de vehículos.
 * Expone estado, handlers y helpers para mapear datos y construir payload.
 */
const useVehicleForm = (initialData = DEFAULT_VEHICLE_FORM_DATA) => (
  useFormState({ initialData, mapData: mapVehicleToFormData })
);

export default useVehicleForm;
