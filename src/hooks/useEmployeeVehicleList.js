import { useCallback, useEffect, useMemo, useState } from 'react';
import VehicleService from '../api/services/VehicleService';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import VehicleStatusService from '../api/services/VehicleStatusService';
import { MESSAGES, PAGINATION } from '../constants';

const DEFAULT_FILTERS = {
  brand: '',
  categoryId: '',
  vehicleStatusId: '',
  currentHeadquartersId: '',
  minPrice: '',
  maxPrice: ''
};

const buildCriteria = (filters, pageNumber) => ({
  brand: filters.brand?.trim() || undefined,
  categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
  vehicleStatusId: filters.vehicleStatusId ? Number(filters.vehicleStatusId) : undefined,
  currentHeadquartersId: filters.currentHeadquartersId ? Number(filters.currentHeadquartersId) : undefined,
  dailyPriceMin: filters.minPrice ? Number(filters.minPrice) : undefined,
  dailyPriceMax: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});

const useEmployeeVehicleList = () => {
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
          VehicleCategoryService.getAll(),
          VehicleStatusService.getAll()
        ]);
        setCategories(categoriesData || []);
        setStatuses(statusesData || []);
      } catch (err) {
        console.error(MESSAGES.ERROR_LOADING_DATA, err);
      }
    };
    loadFilterData();
  }, []);

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

  const filterFields = useMemo(() => ([
    {
      name: 'brand',
      label: MESSAGES.BRAND,
      type: 'text',
      placeholder: MESSAGES.PLACEHOLDER_BRAND
    },
    {
      name: 'categoryId',
      label: MESSAGES.CATEGORY,
      type: 'select',
      placeholder: MESSAGES.ALL_CATEGORIES,
      options: categories.map((category) => ({
        value: category.categoryId ?? category.id,
        label: category.categoryName ?? category.name
      }))
    },
    {
      name: 'vehicleStatusId',
      label: MESSAGES.STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL_STATUSES,
      options: statuses.map((status) => ({
        value: status.vehicleStatusId ?? status.id,
        label: status.statusName ?? status.name
      }))
    },
    {
      name: 'currentHeadquartersId',
      label: MESSAGES.HEADQUARTERS_LABEL,
      type: 'select',
      placeholder: MESSAGES.SELECT_LOCATION
    },
    {
      name: 'minPrice',
      label: MESSAGES.MIN_PRICE,
      type: 'number',
      placeholder: MESSAGES.MIN_PLACEHOLDER,
      min: 0,
      step: 0.01
    },
    {
      name: 'maxPrice',
      label: MESSAGES.MAX_PRICE,
      type: 'number',
      placeholder: MESSAGES.MAX_PLACEHOLDER,
      min: 0,
      step: 0.01
    }
  ]), [categories, statuses]);

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
