import { PAGINATION } from '../constants';

export const EMPLOYEE_LIST_DEFAULT_FILTERS = {
  employeeId: '',
  firstName: '',
  lastName1: '',
  email: '',
  activeStatus: ''
};

const toActiveStatus = (v) => {
  if (v === '' || v == null) return undefined;
  if (typeof v === 'boolean') return v;
  return v === '1' || v === true;
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
