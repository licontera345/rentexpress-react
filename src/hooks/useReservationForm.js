import { useCallback, useState } from 'react';
import { mapReservationToFormData } from '../config/reservationFormUtils';

/**
 * Hook genérico para formularios de reservas.
 * Centraliza manejo de estado, reset y carga de datos existentes.
 */
// Valores por defecto del formulario de reservas.
export const DEFAULT_RESERVATION_FORM_DATA = {
  vehicleId: '',
  userId: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  reservationStatusId: ''
};

// Hook que encapsula el estado y acciones del formulario de reservas.
const useReservationForm = (initialData = DEFAULT_RESERVATION_FORM_DATA) => {
  const [formData, setFormData] = useState(initialData);
  const [formAlert, setFormAlert] = useState(null);

  const handleFormChange = useCallback((event) => {
    // Actualiza el estado según el input editado.
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

  const populateForm = useCallback((reservation) => {
    // Mapea una reserva existente al formato del formulario.
    setFormData(mapReservationToFormData(reservation));
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

export default useReservationForm;
