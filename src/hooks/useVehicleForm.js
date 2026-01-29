import { useCallback, useState } from 'react';

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

const toFormValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

export const mapVehicleToFormData = (vehicle = {}) => ({
  brand: vehicle.brand ?? '',
  model: vehicle.model ?? '',
  licensePlate: vehicle.licensePlate ?? '',
  dailyPrice: toFormValue(vehicle.dailyPrice),
  currentMileage: toFormValue(vehicle.currentMileage ?? vehicle.mileage ?? ''),
  manufactureYear: toFormValue(vehicle.manufactureYear ?? vehicle.year ?? ''),
  vinNumber: vehicle.vinNumber ?? vehicle.vin ?? '',
  categoryId: toFormValue(
    vehicle.categoryId
    ?? vehicle.vehicleCategoryId
    ?? vehicle.vehicleCategory?.categoryId
    ?? vehicle.categories?.categoryId
  ),
  vehicleStatusId: toFormValue(
    vehicle.vehicleStatusId
    ?? vehicle.statusId
    ?? vehicle.vehicleStatus?.vehicleStatusId
    ?? vehicle.status?.vehicleStatusId
  ),
  currentHeadquartersId: toFormValue(
    vehicle.currentHeadquartersId
    ?? vehicle.headquartersId
    ?? vehicle.currentHeadquarters?.headquartersId
  )
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
  currentHeadquartersId: Number(formData.currentHeadquartersId)
});

const useVehicleForm = (initialData = DEFAULT_VEHICLE_FORM_DATA) => {
  const [formData, setFormData] = useState(initialData);
  const [formAlert, setFormAlert] = useState(null);

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setFormAlert(null);
  }, [initialData]);

  const populateForm = useCallback((vehicle) => {
    setFormData(mapVehicleToFormData(vehicle));
  }, []);

  return {
    formData,
    setFormData,
    formAlert,
    setFormAlert,
    handleFormChange,
    resetForm,
    populateForm
  };
};

export default useVehicleForm;
