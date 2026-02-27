import { PAGINATION } from '../../constants';

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

/**
 * Resetea el estado de filtros a los valores por defecto.
 * Útil para páginas que no usan usePaginatedSearch (ej. catálogo público).
 * @param {Function} setFilters - setter del estado de filtros
 * @param {Object} defaultFilters - objeto con los valores por defecto
 */
export const resetFiltersToDefault = (setFilters, defaultFilters) => {
  setFilters(defaultFilters ?? {});
};

/**
 * Inicia un ciclo de carga async: setLoading(true) y opcionalmente setError(null).
 * Usar al inicio de load/c fetch antes del try.
 * @param {Function} setLoading - setter de loading
 * @param {Function} [setError] - setter de error (opcional)
 */
export const startAsyncLoad = (setLoading, setError) => {
  setLoading(true);
  if (setError) setError(null);
};

/**
 * Ejecuta una función async manteniendo estado de "enviando" y opcionalmente
 * ejecutando callbacks al inicio (p. ej. limpiar alertas del formulario).
 * En finally siempre pone setIsSubmitting(false).
 * @param {Function} setIsSubmitting - setter del estado isSubmitting
 * @param {Array<Function>|Function} onStart - callback(s) a ejecutar al inicio (limpiar alertas, etc.)
 * @param {Function} asyncFn - función async a ejecutar
 * @returns {Promise} resultado de asyncFn
 */
export async function withSubmitting(setIsSubmitting, onStart, asyncFn) {
  setIsSubmitting(true);
  const fns = Array.isArray(onStart) ? onStart : onStart ? [onStart] : [];
  fns.forEach((fn) => { if (typeof fn === 'function') fn(); });
  try {
    return await asyncFn();
  } finally {
    setIsSubmitting(false);
  }
}

// Limpia el error de un campo en el estado de errores.
export const clearFieldError = (setErrors, name) => {
  setErrors((prev) => {
    if (!prev[name]) return prev;
    return Object.assign({}, prev, { [name]: null });
  });
};

export const handleFormChangeAndClearError = (form, setErrors, event) => {
  form.handleFormChange(event);
  const name = event?.target?.name;
  if (name) clearFieldError(setErrors, name);
  if (form.setFormAlert) form.setFormAlert(null);
};
