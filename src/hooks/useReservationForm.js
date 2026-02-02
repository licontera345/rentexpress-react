import { useCallback, useState } from 'react';
import { mapReservationToFormData } from '../utils/reservationFormUtils';

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

const useReservationForm = (initialData = DEFAULT_RESERVATION_FORM_DATA) => {
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

  const populateForm = useCallback((reservation) => {
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
