import { useCallback, useState } from 'react';
import { getInputValueFromEvent } from '../_internal/orchestratorUtils';

const useFormState = ({ initialData = {}, mapData } = {}) => {
  // Estado del formulario.
  const [formData, setFormData] = useState(initialData);
  // Estado de alertas.
  const [formAlert, setFormAlert] = useState(null);

  // Actualiza el estado del formulario al cambiar cualquier input.
  // Soporta text, select, textarea y checkbox (usando checked).
  const handleFormChange = useCallback((event) => {
    const { name, value } = getInputValueFromEvent(event);
    setFormData((prev) => Object.assign({}, prev, { [name]: value }));
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

  // Estado y callbacks para el hook.
  return {
    formData,
    setFormData,
    formAlert,
    setFormAlert,
    handleFormChange,
    handleChange: handleFormChange,
    resetForm,
    populateForm
  };
};

export default useFormState;
