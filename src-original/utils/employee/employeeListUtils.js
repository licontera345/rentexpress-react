import { PAGINATION } from '../../constants';

export const EMPLOYEE_LIST_DEFAULT_FILTERS = {
  employeeId: '',
  employeeName: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  email: '',
  phone: '',
  roleId: '',
  headquartersId: '',
  activeStatus: ''
};

const toActiveStatus = (v) => {
  if (v === '' || v == null) return undefined;
  if (v === '1' || v === 1 || v === true) return true;
  return false;
};

export const buildEmployeeSearchCriteria = (filters, pageNumber) => ({
  employeeId: filters.employeeId ? Number(filters.employeeId) : undefined,
  employeeName: filters.employeeName?.trim() || undefined,
  firstName: filters.firstName?.trim() || undefined,
  lastName1: filters.lastName1?.trim() || undefined,
  lastName2: filters.lastName2?.trim() || undefined,
  email: filters.email?.trim() || undefined,
  phone: filters.phone?.trim() || undefined,
  roleId: filters.roleId ? Number(filters.roleId) : undefined,
  headquartersId: filters.headquartersId ? Number(filters.headquartersId) : undefined,
  activeStatus: toActiveStatus(filters.activeStatus),
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});
