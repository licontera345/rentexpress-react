import useFormState from '../core/useFormState';
import {
  DEFAULT_VEHICLE_FORM_DATA,
  mapVehicleToFormData,
  buildVehiclePayload
} from '../../utils/vehicle';

export { DEFAULT_VEHICLE_FORM_DATA, mapVehicleToFormData, buildVehiclePayload };

const useVehicleForm = (initialData = DEFAULT_VEHICLE_FORM_DATA) => (
  useFormState({ initialData, mapData: mapVehicleToFormData })
);

export default useVehicleForm;
