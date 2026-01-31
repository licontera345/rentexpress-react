import { useCallback, useEffect, useMemo, useState } from 'react';
import VehicleService from '../api/services/VehicleService';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import VehicleStatusService from '../api/services/VehicleStatusService';
import { MESSAGES, PAGINATION } from '../constants';
import { buildVehicleFilterFields } from '../config/vehicleFilterFields';
import { buildVehicleSearchCriteria } from '../utils/vehicleSearchCriteria';
import { getVehicleFilterDefaults } from '../utils/vehicleFilterDefaults';
import useLocale from './useLocale';

const DEFAULT_FILTERS = getVehicleFilterDefaults({
  includeIdentifiers: true,
  includeStatus: true,
  includeActiveStatus: true
});

const buildCriteria = (filters, pageNumber) => buildVehicleSearchCriteria(filters, {
  includeIdentifiers: true,
  includeStatus: true,
  includeActiveStatus: true,
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});

const useEmployeeVehicleList = () => {
  const locale = useLocale();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: PAGINATION.DEFAULT_PAGE,
    totalPages: PAGINATION.DEFAULT_PAGE,
    totalRecords: 0
  });

  const loadVehicles = useCallback(async ({ nextFilters = DEFAULT_FILTERS, pageNumber = PAGINATION.DEFAULT_PAGE } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const criteria = buildCriteria(nextFilters, pageNumber);
      const response = await VehicleService.search(criteria);
      const results = response?.results || response || [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / criteria.pageSize));

      setVehicles(results);
      setPagination({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      });
    } catch (err) {
      setError(err.message || MESSAGES.ERROR_LOADING_DATA);
      setVehicles([]);
      setPagination({
        pageNumber: PAGINATION.DEFAULT_PAGE,
        totalPages: PAGINATION.DEFAULT_PAGE,
        totalRecords: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadVehicles]);

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [categoriesData, statusesData] = await Promise.all([
          VehicleCategoryService.getAll(locale),
          VehicleStatusService.getAll(locale)
        ]);
        setCategories(categoriesData || []);
        setStatuses(statusesData || []);
      } catch (err) {
        console.error(MESSAGES.ERROR_LOADING_DATA, err);
      }
    };
    loadFilterData();
  }, [locale]);

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(() => {
    loadVehicles({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadVehicles]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadVehicles({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadVehicles]);

  const handlePageChange = useCallback((nextPage) => {
    loadVehicles({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadVehicles]);

  const filterFields = useMemo(() => (
    buildVehicleFilterFields({
      categories,
      statuses,
      includeIdentifiers: true,
      includeStatus: true,
      includeActiveStatus: true,
      includeHeadquarters: true
    })
  ), [categories, statuses]);

  return {
    vehicles,
    loading,
    error,
    filters,
    categories,
    statuses,
    pagination,
    filterFields,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
    loadVehicles
  };
};

export default useEmployeeVehicleList;
