import { useCallback, useState } from 'react';

/**
 * Hook genérico para manejar estado de formularios.
 * Centraliza cambios de inputs, reset y carga de datos opcionalmente mapeados.
 */
const useFormState = ({ initialData = {}, mapData } = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [formAlert, setFormAlert] = useState(null);

  // Actualiza el estado del formulario al cambiar cualquier input.
  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  // Restaura el formulario a sus valores iniciales y limpia alertas.
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setFormAlert(null);
  }, [initialData]);

  // Pre-carga el formulario con datos ya existentes (con mapping opcional).
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
