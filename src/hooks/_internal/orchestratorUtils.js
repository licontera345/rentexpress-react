import { PAGINATION } from '../../constants';

/**
 * Utilidades compartidas por hooks de páginas: paginación, lectura de eventos de input y actualización de filtros/errores.
 */
export const createPaginationState = ({
  pageNumber = PAGINATION.DEFAULT_PAGE,
  totalPages = PAGINATION.DEFAULT_PAGE,
  totalRecords = 0
} = {}) => ({
  pageNumber,
  totalPages,
  totalRecords
});

// Crea estado de paginación vacío  
export const createEmptyPaginationState = () => createPaginationState();

// Extrae nombre y valor de un evento de input (text, select, textarea, checkbox).
export const getInputValueFromEvent = (event) => {
  const { name, value, type, checked } = event.target;
  const nextValue = type === 'checkbox' ? checked : value;
  return { name, value: nextValue };
};

// Actualiza estado de filtros a partir de un evento de input.
export const updateFilterValue = (setFilters, event) => {
  const { name, value } = getInputValueFromEvent(event);
  setFilters((prev) => Object.assign({}, prev, { [name]: value }));
};

// Limpia el error de un campo en el estado de errores.
export const clearFieldError = (setErrors, name) => {
  setErrors((prev) => {
    if (!prev[name]) return prev;
    return Object.assign({}, prev, { [name]: null });
  });
};

/**
 * Manejador de cambio de formulario que actualiza el form, limpia el error del campo y opcionalmente el alert.
 * Evita repetir el mismo patrón en hooks de create/edit (reservas, vehículos, etc.).
 *
 * @param {{ handleFormChange: (e: any) => void, setFormAlert?: (a: any) => void }} form - Objeto form (useFormState)
 * @param {Function} setErrors - setState de errores por campo
 * @param {React.SyntheticEvent} event - Evento de cambio
 */
export const handleFormChangeAndClearError = (form, setErrors, event) => {
  form.handleFormChange(event);
  const name = event?.target?.name;
  if (name) clearFieldError(setErrors, name);
  if (form.setFormAlert) form.setFormAlert(null);
};
