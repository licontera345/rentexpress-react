import { toFormControlValue } from '../form/formatters';

export const DEFAULT_VEHICLE_FORM_DATA = {
  brand: '', model: '', licensePlate: '', dailyPrice: '', currentMileage: '',
  manufactureYear: '', vinNumber: '', categoryId: '', vehicleStatusId: '', currentHeadquartersId: '',
};

export const mapVehicleToFormData = (vehicle = {}) => ({
  brand: vehicle.brand ?? '',
  model: vehicle.model ?? '',
  licensePlate: vehicle.licensePlate ?? '',
  dailyPrice: toFormControlValue(vehicle.dailyPrice),
  currentMileage: toFormControlValue(vehicle.currentMileage ?? ''),
  manufactureYear: toFormControlValue(vehicle.manufactureYear ?? ''),
  vinNumber: vehicle.vinNumber ?? '',
  categoryId: toFormControlValue(vehicle.categoryId ?? vehicle.vehicleCategory?.categoryId),
  vehicleStatusId: toFormControlValue(vehicle.vehicleStatusId ?? vehicle.vehicleStatus?.vehicleStatusId),
  currentHeadquartersId: toFormControlValue(vehicle.currentHeadquartersId ?? vehicle.currentHeadquarters?.id),
});

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
  currentHeadquartersId: Number(formData.currentHeadquartersId),
});
