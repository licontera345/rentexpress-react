import { mapReservationToFormData } from '../config/reservationFormUtils';
import useFormState from './useFormState';

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
const useReservationForm = (initialData = DEFAULT_RESERVATION_FORM_DATA) => (
  useFormState({ initialData, mapData: mapReservationToFormData })
);

export default useReservationForm;
