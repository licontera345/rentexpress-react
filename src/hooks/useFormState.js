import { useCallback, useState } from 'react';

/**
 * Hook genérico para manejar estado de formularios.
 * Centraliza cambios de inputs, reset y carga de datos opcionalmente mapeados.
 */
const useFormState = ({ initialData = {}, mapData } = {}) => {
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

  const populateForm = useCallback((data) => {
    if (mapData) {
      setFormData(mapData(data));
      return;
    }
    setFormData(data);
  }, [mapData]);

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

export default useFormState;
