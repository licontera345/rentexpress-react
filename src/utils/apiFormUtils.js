import { MESSAGES, PAGINATION } from '../constants';

/** Normaliza criterios de búsqueda del catálogo (paginación). */
export const normalizeCatalogCriteria = (criteria) => {
  return Object.assign({}, criteria, {
    pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
    pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE
  });
};

/** Traduce un error HTTP en un mensaje de UI para reservas. */
export const resolveReservationErrorMessage = (err) => {
  if (!err) return MESSAGES.UNEXPECTED_ERROR;
  switch (err.status) {
    case 401:
      return MESSAGES.SESSION_EXPIRED || MESSAGES.UNAUTHORIZED;
    case 403:
      return MESSAGES.FORBIDDEN;
    case 404:
      return MESSAGES.NOT_FOUND;
    default:
      return err.message || MESSAGES.UNEXPECTED_ERROR;
  }
};
