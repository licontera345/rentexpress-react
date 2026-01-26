import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useVehicleSearch from './useVehicleSearch';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import VehicleStatusService from '../api/services/VehicleStatusService';
import { MESSAGES, PAGINATION } from '../constants';

const DEFAULT_FILTERS = {
  brand: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  manufactureYearFrom: '',
  manufactureYearTo: '',
  currentMileageMin: '',
  currentMileageMax: '',
  vehicleStatusId: ''
};

const useCatalogPage = () => {
  const location = useLocation();
  const { vehicles, loading, error, searchVehicles } = useVehicleSearch();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [lastCriteria, setLastCriteria] = useState(null);
  const initialCriteria = useMemo(() => location.state?.criteria ?? null, [location.state]);

  useEffect(() => {
    if (initialCriteria) {
      const normalizedCriteria = {
        ...initialCriteria,
        pageNumber: initialCriteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
        pageSize: initialCriteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE
      };
      setLastCriteria(normalizedCriteria);
      searchVehicles(normalizedCriteria).catch(() => {});
    }
  }, [initialCriteria, searchVehicles]);

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

  const handleSearch = useCallback((criteria) => {
    const normalizedCriteria = {
      ...criteria,
      pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
      pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE
    };
    setLastCriteria(normalizedCriteria);
    setFilters(DEFAULT_FILTERS);
    searchVehicles(normalizedCriteria).catch(() => {});
  }, [searchVehicles]);

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(() => {
    if (!lastCriteria) {
      return;
    }

    const filteredCriteria = {
      ...lastCriteria,
      brand: filters.brand?.trim() || undefined,
      categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
      vehicleStatusId: filters.vehicleStatusId ? Number(filters.vehicleStatusId) : undefined,
      dailyPriceMin: filters.minPrice ? Number(filters.minPrice) : undefined,
      dailyPriceMax: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      manufactureYearFrom: filters.manufactureYearFrom ? Number(filters.manufactureYearFrom) : undefined,
      manufactureYearTo: filters.manufactureYearTo ? Number(filters.manufactureYearTo) : undefined,
      currentMileageMin: filters.currentMileageMin ? Number(filters.currentMileageMin) : undefined,
      currentMileageMax: filters.currentMileageMax ? Number(filters.currentMileageMax) : undefined
    };
    searchVehicles(filteredCriteria).catch(() => {});
  }, [filters, lastCriteria, searchVehicles]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    if (lastCriteria) {
      searchVehicles(lastCriteria).catch(() => {});
    }
  }, [lastCriteria, searchVehicles]);

  const handleCloseDetail = useCallback(() => {
    setSelectedVehicleId(null);
  }, []);

  const brandOptions = useMemo(() => {
    const uniqueBrands = new Set();
    vehicles.forEach((vehicle) => {
      if (vehicle?.brand) {
        uniqueBrands.add(vehicle.brand);
      }
    });
    return Array.from(uniqueBrands).sort((a, b) => a.localeCompare(b));
  }, [vehicles]);

  return {
    vehicles,
    loading,
    error,
    initialCriteria,
    filters,
    categories,
    statuses,
    brandOptions,
    hasSearched: Boolean(lastCriteria),
    selectedVehicleId,
    setSelectedVehicleId,
    handleSearch,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handleCloseDetail
  };
};

export default useCatalogPage;
