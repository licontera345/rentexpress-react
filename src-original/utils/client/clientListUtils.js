import { PAGINATION } from '../../constants';

export const CLIENT_LIST_DEFAULT_FILTERS = {
  userId: '',
  username: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  email: '',
  phone: '',
  roleId: '',
  activeStatus: ''
};

const toActiveStatus = (v) => {
  if (v === '' || v == null) return undefined;
  if (v === '1' || v === 1 || v === true) return true;
  return false;
};

export const buildUserSearchCriteria = (filters, pageNumber) => ({
  userId: filters.userId ? Number(filters.userId) : undefined,
  username: filters.username?.trim() || undefined,
  firstName: filters.firstName?.trim() || undefined,
  lastName1: filters.lastName1?.trim() || undefined,
  lastName2: filters.lastName2?.trim() || undefined,
  email: filters.email?.trim() || undefined,
  phone: filters.phone?.trim() || undefined,
  roleId: filters.roleId ? Number(filters.roleId) : undefined,
  activeStatus: toActiveStatus(filters.activeStatus),
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});
