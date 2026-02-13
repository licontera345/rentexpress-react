import { PAGINATION } from '../constants';

// Normaliza criterios de búsqueda del catálogo (paginación y estado por defecto).
export const normalizeCatalogCriteria = (criteria, availableStatusId) => {
  return Object.assign({}, criteria, {
    pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
    pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
    vehicleStatusId: availableStatusId ?? criteria.vehicleStatusId
  });
};
