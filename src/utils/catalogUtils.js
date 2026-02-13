import { PAGINATION } from '../constants';

// Normaliza criterios de búsqueda del catálogo (solo paginación).
// La API debe decidir qué vehículos son "reservables" por defecto (ej. disponibles/activos).
export const normalizeCatalogCriteria = (criteria) => {
  return Object.assign({}, criteria, {
    pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
    pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE
  });
};
