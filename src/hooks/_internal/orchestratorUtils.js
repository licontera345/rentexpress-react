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
