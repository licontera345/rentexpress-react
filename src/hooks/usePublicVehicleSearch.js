import { useCallback, useEffect, useState } from 'react';
import VehicleService from '../api/services/VehicleService';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import { DEFAULT_ACTIVE_STATUS, FILTER_DEFAULTS, PAGINATION } from '../constants';
import { MESSAGES } from '../constants/messages';

const DEFAULT_FILTERS = Object.assign({}, FILTER_DEFAULTS);

const usePublicVehicleSearch = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      setFilters(DEFAULT_FILTERS);
      const [vehiclesData, categoriesData] = await Promise.all([
        VehicleService.search({
          activeStatus: DEFAULT_ACTIVE_STATUS,
          pageNumber: PAGINATION.DEFAULT_PAGE,
          pageSize: PAGINATION.DEFAULT_PAGE_SIZE
        }),
        VehicleCategoryService.getAll()
      ]);
      setVehicles(vehiclesData.results || vehiclesData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error(MESSAGES.ERROR_LOADING_DATA, error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      const results = await VehicleService.search({
        brand: filters.brand?.trim() || undefined,
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
        dailyPriceMin: filters.minPrice ? Number(filters.minPrice) : undefined,
        dailyPriceMax: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        activeStatus: DEFAULT_ACTIVE_STATUS,
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });
      setVehicles(results.results || results || []);
    } catch (error) {
      console.error(MESSAGES.ERROR_LOADING_DATA, error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return {
    vehicles,
    loading,
    categories,
    filters,
    applyFilters,
    handleFilterChange,
    loadInitialData
  };
};

export default usePublicVehicleSearch;
