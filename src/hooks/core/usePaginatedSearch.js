import { useCallback, useEffect, useState } from 'react';
import { PAGINATION } from '../../constants';
import { createEmptyPaginationState, createPaginationState, updateFilterValue } from '../_internal/orchestratorUtils';

/**
 * Hook genérico para listados con filtros + paginación.
 * buildCriteria(filters, pageNumber) debe devolver un objeto con al menos pageSize.
 * fetch(criteria) debe devolver Promise<{ results?, totalRecords?, totalPages?, pageNumber? }>.
 *
 * @param {Object} options
 * @param {Object} options.defaultFilters - Valores iniciales de filtros
 * @param {(filters: Object, pageNumber: number) => Object} options.buildCriteria
 * @param {(criteria: Object) => Promise<{ results?, totalRecords?, totalPages?, pageNumber? }>} options.fetch
 * @param {number} [options.defaultPageSize=PAGINATION.DEFAULT_PAGE_SIZE] - Para calcular totalPages si la API no lo devuelve
 * @param {string} [options.errorMessage] - Mensaje de error por defecto
 */
function usePaginatedSearch({
  defaultFilters,
  buildCriteria,
  fetch: fetchFn,
  defaultPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  errorMessage
} = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(defaultFilters ?? {});
  const [pagination, setPagination] = useState(createEmptyPaginationState);

  const loadItems = useCallback(async ({
    nextFilters = defaultFilters,
    pageNumber = PAGINATION.DEFAULT_PAGE
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const criteria = buildCriteria(nextFilters, pageNumber);
      const response = await fetchFn(criteria);
      const results = response?.results ?? response ?? [];
      const totalRecords = response?.totalRecords ?? (Array.isArray(results) ? results.length : 0);
      const pageSize = criteria?.pageSize ?? defaultPageSize;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / pageSize));
      const currentPage = response?.pageNumber ?? pageNumber;

      setItems(Array.isArray(results) ? results : []);
      setPagination(createPaginationState({
        pageNumber: currentPage,
        totalPages,
        totalRecords
      }));
    } catch (err) {
      setError(err?.message || errorMessage || 'Error al cargar');
      setItems([]);
      setPagination(createEmptyPaginationState());
    } finally {
      setLoading(false);
    }
  }, [defaultFilters, buildCriteria, fetchFn, defaultPageSize, errorMessage]);

  useEffect(() => {
    loadItems({ nextFilters: defaultFilters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadItems]);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback(() => {
    loadItems({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadItems]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters ?? {});
    loadItems({ nextFilters: defaultFilters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [defaultFilters, loadItems]);

  const handlePageChange = useCallback((nextPage) => {
    loadItems({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadItems]);

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    loadItems,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange
  };
}

export default usePaginatedSearch;
