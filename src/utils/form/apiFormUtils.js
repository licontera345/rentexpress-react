import { MESSAGES, PAGINATION } from '../../constants';
import { getApiErrorMessage } from '../ui/uiUtils';

export const normalizeCatalogCriteria = (criteria) => {
  return Object.assign({}, criteria, {
    pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
    pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE
  });
};

export const resolveReservationErrorMessage = (err) => {
  if (!err) return MESSAGES.UNEXPECTED_ERROR;
  const status = err.response?.status ?? err.status;
  switch (status) {
    case 401:
      return MESSAGES.SESSION_EXPIRED || MESSAGES.UNAUTHORIZED;
    case 403:
      return MESSAGES.FORBIDDEN;
    case 404:
      return MESSAGES.ERROR_NOT_FOUND;
    default:
      return getApiErrorMessage(err, 'UNEXPECTED_ERROR');
  }
};
