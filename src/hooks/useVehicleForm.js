import { useCallback, useState } from 'react';

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
const useVehicleForm = (initialData = DEFAULT_VEHICLE_FORM_DATA) => {
  const [formData, setFormData] = useState(initialData);
  const [formAlert, setFormAlert] = useState(null);

  const handleFormChange = useCallback((event) => {
    // Actualiza el campo modificado por el usuario.
    const { name, value } = event.target;
    setFormData((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    // Restaura valores iniciales y limpia alertas.
    setFormData(initialData);
    setFormAlert(null);
  }, [initialData]);

  const populateForm = useCallback((vehicle) => {
    // Carga un vehículo existente en el formulario.
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
