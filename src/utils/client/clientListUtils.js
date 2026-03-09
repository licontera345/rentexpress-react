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

/** Nombres de query params en URL para la lista de clientes (page, size, q, role, status) */
export const CLIENT_LIST_PARAM_NAMES = {
  PAGE: 'page',
  SIZE: 'size',
  Q: 'q',
  ROLE: 'role',
  STATUS: 'status',
};

/**
 * Parsea searchParams de la URL a filtros y página inicial para la lista de clientes.
 * @param {URLSearchParams} searchParams
 * @returns {{ initialFilters: object, initialPage: number }}
 */
export function parseClientListSearchParams(searchParams) {
  const page = Math.max(1, parseInt(searchParams.get(CLIENT_LIST_PARAM_NAMES.PAGE), 10) || PAGINATION.DEFAULT_PAGE);
  const q = searchParams.get(CLIENT_LIST_PARAM_NAMES.Q) || '';
  const role = searchParams.get(CLIENT_LIST_PARAM_NAMES.ROLE) || '';
  const status = searchParams.get(CLIENT_LIST_PARAM_NAMES.STATUS) || '';
  return {
    initialFilters: {
      ...CLIENT_LIST_DEFAULT_FILTERS,
      username: q,
      roleId: role,
      activeStatus: status,
    },
    initialPage: page,
  };
}

/**
 * Construye un objeto de query params para la URL a partir de filtros y página.
 * @param {object} filters
 * @param {number} page
 * @returns {Record<string, string>}
 */
export function buildClientListSearchParams(filters, page) {
  const params = {};
  const p = Number(page);
  if (p > 1) params[CLIENT_LIST_PARAM_NAMES.PAGE] = String(p);
  const q = filters?.username?.trim?.();
  if (q) params[CLIENT_LIST_PARAM_NAMES.Q] = q;
  const role = filters?.roleId;
  if (role) params[CLIENT_LIST_PARAM_NAMES.ROLE] = String(role);
  const status = filters?.activeStatus;
  if (status !== '' && status !== undefined && status !== null) params[CLIENT_LIST_PARAM_NAMES.STATUS] = String(status);
  return params;
}

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
