import { PAGINATION } from '../../constants';

export const createPaginationState = ({
  pageNumber = PAGINATION.DEFAULT_PAGE,
  totalPages = PAGINATION.DEFAULT_PAGE,
  totalRecords = 0,
} = {}) => ({
  pageNumber,
  totalPages,
  totalRecords,
});

export const createEmptyPaginationState = () => createPaginationState();

export const getInputValueFromEvent = (event) => {
  const { name, value, type, checked } = event.target;
  const nextValue = type === 'checkbox' ? checked : value;
  return { name, value: nextValue };
};

export const updateFilterValue = (setFilters, event) => {
  const { name, value } = getInputValueFromEvent(event);
  setFilters((prev) => Object.assign({}, prev, { [name]: value }));
};

export const resetFiltersToDefault = (setFilters, defaultFilters) => {
  setFilters(defaultFilters ?? {});
};

export const startAsyncLoad = (setLoading, setError) => {
  setLoading(true);
  if (setError) setError(null);
};

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
