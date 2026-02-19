import { PAGINATION } from '../constants';

export const EMPLOYEE_LIST_DEFAULT_FILTERS = {
  employeeId: '',
  firstName: '',
  lastName1: '',
  email: '',
  activeStatus: ''
};

/** Convierte el valor del filtro a tinyint para la API: 1 = activo, 0 = inactivo, undefined = sin filtrar. */
const toActiveStatus = (v) => {
  if (v === '' || v == null) return undefined;
  if (v === '1' || v === 1 || v === true) return 1;
  return 0;
};

export const buildEmployeeSearchCriteria = (filters, pageNumber) => ({
  employeeId: filters.employeeId || undefined,
  firstName: filters.firstName || undefined,
  lastName1: filters.lastName1 || undefined,
  email: filters.email || undefined,
  activeStatus: toActiveStatus(filters.activeStatus),
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});
