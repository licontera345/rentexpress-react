import { useCallback, useEffect, useRef, useState } from 'react';
import { PAGINATION } from '../../constants';
import { getResultsList, getPaginatedMeta, getFriendlyErrorMessage } from '../../utils/api/apiResponseUtils';
import { createEmptyPaginationState, createPaginationState, updateFilterValue, resetFiltersToDefault, startAsyncLoad } from '../_internal/orchestratorUtils';

function usePaginatedSearch({
  defaultFilters,
  buildCriteria,
  fetch: fetchFn,
  defaultPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  errorMessage,
  initialPage,
} = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(defaultFilters ?? {});
  const [pagination, setPagination] = useState(createEmptyPaginationState);

  const loadItems = useCallback(async ({
    nextFilters = defaultFilters,
    pageNumber = PAGINATION.DEFAULT_PAGE,
  } = {}) => {
    startAsyncLoad(setLoading, setError);

    try {
      const criteria = buildCriteria(nextFilters, pageNumber);
      const response = await fetchFn(criteria);
      const results = getResultsList(response);
      const pageSize = criteria?.pageSize ?? defaultPageSize;
      const meta = getPaginatedMeta(response, { pageNumber, pageSize }, results.length);

      setItems(results);
      setPagination(createPaginationState({
        pageNumber: meta.pageNumber,
        totalPages: meta.totalPages,
        totalRecords: meta.totalRecords,
      }));
    } catch (err) {
      setError(getFriendlyErrorMessage(err, errorMessage || 'ERROR_LOAD_DEFAULT'));
      setItems([]);
      setPagination(createEmptyPaginationState());
    } finally {
      setLoading(false);
    }
  }, [defaultFilters, buildCriteria, fetchFn, defaultPageSize, errorMessage]);

  const loadItemsRef = useRef(loadItems);
  loadItemsRef.current = loadItems;

  useEffect(() => {
    const page = initialPage != null && initialPage >= 1 ? initialPage : PAGINATION.DEFAULT_PAGE;
    loadItemsRef.current({ nextFilters: defaultFilters, pageNumber: page }).catch(() => {});
  }, [defaultFilters, initialPage]);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback((overrideFilters) => {
    const nextFilters = overrideFilters !== undefined ? overrideFilters : filters;
    if (overrideFilters !== undefined) {
      setFilters(overrideFilters);
    }
    loadItems({ nextFilters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadItems]);

  const resetFilters = useCallback(() => {
    resetFiltersToDefault(setFilters, defaultFilters);
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
    handlePageChange,
  };
}

export default usePaginatedSearch;
