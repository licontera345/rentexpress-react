import { useCallback, useEffect, useRef, useState } from 'react';
import { PAGINATION } from '../constants/index.js';
import { getResultsList, getPaginatedMeta } from '../utils/api.js';

function getInputValue(event) {
  const { name, value, type, checked } = event.target ?? {};
  return { name, value: type === 'checkbox' ? checked : value };
}

/**
 * Lista paginada con filtros. Un solo hook para todas las listas (empleados, clientes, vehículos, reservas, alquileres).
 * options: { fetchFn(criteria) => Promise<response>, defaultFilters, defaultPageSize }
 * fetchFn recibe { pageNumber, pageSize, ...filters } y devuelve la respuesta cruda de la API.
 */
export function usePaginatedSearch(options = {}) {
  const {
    fetchFn,
    defaultFilters = {},
    defaultPageSize = PAGINATION.SEARCH_PAGE_SIZE,
  } = options;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({
    pageNumber: PAGINATION.DEFAULT_PAGE,
    totalPages: 0,
    totalRecords: 0,
  });

  const loadRef = useRef(null);

  const load = useCallback(
    async (nextFilters = filters, pageNumber = PAGINATION.DEFAULT_PAGE) => {
      if (typeof fetchFn !== 'function') return;
      setLoading(true);
      setError(null);
      try {
        const criteria = {
          ...nextFilters,
          pageNumber,
          pageSize: nextFilters.pageSize ?? defaultPageSize,
        };
        const response = await fetchFn(criteria);
        const list = getResultsList(response);
        const meta = getPaginatedMeta(response, { pageNumber, pageSize: criteria.pageSize }, list.length);
        setItems(list);
        setPagination({
          pageNumber: meta.pageNumber,
          totalPages: meta.totalPages,
          totalRecords: meta.totalRecords,
        });
      } catch (err) {
        setError(err?.message ?? err);
        setItems([]);
        setPagination((p) => ({ ...p, totalPages: 0, totalRecords: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, defaultPageSize]
  );

  loadRef.current = load;

  useEffect(() => {
    loadRef.current?.(defaultFilters, PAGINATION.DEFAULT_PAGE);
  }, []);

  const setFilterFromEvent = useCallback((event) => {
    const { name, value } = getInputValue(event);
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    load(filters, PAGINATION.DEFAULT_PAGE);
  }, [filters, load]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    load(defaultFilters, PAGINATION.DEFAULT_PAGE);
  }, [defaultFilters, load]);

  const goToPage = useCallback(
    (pageNumber) => {
      load(filters, pageNumber);
    },
    [filters, load]
  );

  const refresh = useCallback(() => {
    load(filters, pagination.pageNumber);
  }, [filters, pagination.pageNumber, load]);

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    setFilterFromEvent,
    pagination,
    applyFilters,
    resetFilters,
    goToPage,
    refresh,
  };
}

export default usePaginatedSearch;
