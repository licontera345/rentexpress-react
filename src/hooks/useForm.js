import { useCallback, useState } from 'react';

function getInputValue(event) {
  const { name, value, type, checked } = event.target ?? {};
  return { name, value: type === 'checkbox' ? checked : value };
}

/**
 * Estado de formulario reutilizable. Un solo hook para todos los formularios y modales.
 * initialValues = objeto. mapFromApi(data) opcional para rellenar desde la API.
 */
export function useForm(initialValues = {}, options = {}) {
  const { mapFromApi } = options;
  const [values, setValues] = useState(initialValues);
  const [alert, setAlert] = useState(null);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFromEvent = useCallback((event) => {
    const { name, value } = getInputValue(event);
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setAlert(null);
  }, [initialValues]);

  const populate = useCallback(
    (data) => {
      if (mapFromApi) {
        setValues(mapFromApi(data));
        return;
      }
      setValues(typeof data === 'object' && data !== null ? { ...data } : initialValues);
    },
    [mapFromApi, initialValues]
  );

  return {
    values,
    setValues,
    setValue,
    setFromEvent,
    reset,
    populate,
    alert,
    setAlert,
  };
}

export default useForm;
