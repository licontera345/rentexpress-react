import useFormState from './useFormState';

/**
 * Hook de formulario de vehículos.
 * Expone helpers para mapear datos, resetear y construir el payload del backend.
 */
// Valores por defecto del formulario de vehículos.
export const DEFAULT_VEHICLE_FORM_DATA = {
  brand: '',
  model: '',
  licensePlate: '',
  dailyPrice: '',
  currentMileage: '',
  manufactureYear: '',
  vinNumber: '',
  categoryId: '',
  vehicleStatusId: '',
  currentHeadquartersId: ''
};

// Convierte valores a string para inputs controlados.
const toFormValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

// Mapea un vehículo a la estructura esperada por el formulario.
export const mapVehicleToFormData = (vehicle = {}) => ({
  brand: vehicle.brand ?? '',
  model: vehicle.model ?? '',
  licensePlate: vehicle.licensePlate ?? '',
  dailyPrice: toFormValue(vehicle.dailyPrice),
  currentMileage: toFormValue(vehicle.currentMileage ?? ''),
  manufactureYear: toFormValue(vehicle.manufactureYear ?? ''),
  vinNumber: vehicle.vinNumber ?? '',
  categoryId: toFormValue(
    vehicle.categoryId
    ?? vehicle.vehicleCategory?.categoryId
  ),
  vehicleStatusId: toFormValue(
    vehicle.vehicleStatusId
    ?? vehicle.vehicleStatus?.vehicleStatusId
  ),
  currentHeadquartersId: toFormValue(
    vehicle.currentHeadquartersId
    ?? vehicle.currentHeadquarters?.id
  )
});

// Construye el payload para el backend a partir del formulario.
export const buildVehiclePayload = (formData) => ({
  brand: formData.brand.trim(),
  model: formData.model.trim(),
  licensePlate: formData.licensePlate.trim(),
  dailyPrice: Number(formData.dailyPrice),
  currentMileage: formData.currentMileage ? Number(formData.currentMileage) : 0,
  manufactureYear: Number(formData.manufactureYear),
  vinNumber: formData.vinNumber.trim(),
  categoryId: Number(formData.categoryId),
  vehicleStatusId: Number(formData.vehicleStatusId),
  currentHeadquartersId: Number(formData.currentHeadquartersId)
});

// Hook que administra el estado del formulario de vehículos.
const useVehicleForm = (initialData = DEFAULT_VEHICLE_FORM_DATA) => (
  useFormState({ initialData, mapData: mapVehicleToFormData })
);

export default useVehicleForm;
