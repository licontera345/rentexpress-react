import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useVehicleSearch from './useVehicleSearch';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import VehicleStatusService from '../api/services/VehicleStatusService';
import { MESSAGES, PAGINATION } from '../constants';
import useLocale from './useLocale';

const DEFAULT_FILTERS = {
  brand: '',
  model: '',
  categoryId: '',
  currentHeadquartersId: '',
  minPrice: '',
  maxPrice: '',
  manufactureYearFrom: '',
  manufactureYearTo: '',
  currentMileageMin: '',
  currentMileageMax: ''
};

const AVAILABLE_STATUS_LABELS = new Set([
  'available',
  'disponible',
  MESSAGES.AVAILABLE?.toLowerCase()
].filter(Boolean));

const normalizeStatusValue = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : ''
);

const getVehicleStatusId = (vehicle) => (
  vehicle?.vehicleStatusId
  ?? vehicle?.vehicleStatus?.vehicleStatusId
  ?? vehicle?.status?.vehicleStatusId
  ?? vehicle?.statusId
);

const getVehicleStatusName = (vehicle) => (
  vehicle?.statusName
  ?? vehicle?.vehicleStatus?.statusName
  ?? vehicle?.status?.statusName
  ?? vehicle?.vehicleStatus?.name
  ?? vehicle?.status?.name
);

const useCatalogPage = () => {
  const location = useLocation();
  const locale = useLocale();
  const { vehicles, loading, error, searchVehicles } = useVehicleSearch();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [lastCriteriaState, setLastCriteria] = useState(null);
  const initialCriteria = useMemo(() => location.state?.criteria ?? null, [location.state]);
  const availableStatusId = useMemo(() => {
    const normalized = statuses.map((status) => ({
      id: status.vehicleStatusId ?? status.id,
      name: normalizeStatusValue(status.statusName ?? status.name)
    }));
    const availableStatus = normalized.find((status) => AVAILABLE_STATUS_LABELS.has(status.name));
    return availableStatus?.id;
  }, [statuses]);
  const normalizedInitialCriteria = useMemo(() => {
    if (!initialCriteria) {
      return null;
    }

    return Object.assign({}, initialCriteria, {
      pageNumber: initialCriteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
      pageSize: initialCriteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
      vehicleStatusId: availableStatusId ?? initialCriteria.vehicleStatusId
    });
  }, [availableStatusId, initialCriteria]);
  const lastCriteria = lastCriteriaState ?? normalizedInitialCriteria;

  useEffect(() => {
    if (normalizedInitialCriteria && !lastCriteriaState) {
      searchVehicles(normalizedInitialCriteria).catch(() => {});
    }
  }, [lastCriteriaState, normalizedInitialCriteria, searchVehicles]);

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

  const handleSearch = useCallback((criteria) => {
    const normalizedCriteria = Object.assign({}, criteria, {
      pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
      pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
      vehicleStatusId: availableStatusId ?? criteria.vehicleStatusId
    });
    setLastCriteria(normalizedCriteria);
    setFilters(DEFAULT_FILTERS);
    searchVehicles(normalizedCriteria).catch(() => {});
  }, [availableStatusId, searchVehicles]);

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(() => {
    if (!lastCriteria) {
      return;
    }

    const filteredCriteria = Object.assign({}, lastCriteria, {
      brand: filters.brand?.trim() || undefined,
      model: filters.model?.trim() || undefined,
      categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
      currentHeadquartersId: filters.currentHeadquartersId ? Number(filters.currentHeadquartersId) : undefined,
      vehicleStatusId: availableStatusId ?? lastCriteria.vehicleStatusId,
      dailyPriceMin: filters.minPrice ? Number(filters.minPrice) : undefined,
      dailyPriceMax: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      manufactureYearFrom: filters.manufactureYearFrom ? Number(filters.manufactureYearFrom) : undefined,
      manufactureYearTo: filters.manufactureYearTo ? Number(filters.manufactureYearTo) : undefined,
      currentMileageMin: filters.currentMileageMin ? Number(filters.currentMileageMin) : undefined,
      currentMileageMax: filters.currentMileageMax ? Number(filters.currentMileageMax) : undefined
    });
    searchVehicles(filteredCriteria).catch(() => {});
  }, [availableStatusId, filters, lastCriteria, searchVehicles]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    if (lastCriteria) {
      searchVehicles(lastCriteria).catch(() => {});
    }
  }, [lastCriteria, searchVehicles]);

  const handleCloseDetail = useCallback(() => {
    setSelectedVehicleId(null);
  }, []);

  const availableVehicles = useMemo(() => {
    const availableLabelMatch = (vehicle) => {
      const statusName = normalizeStatusValue(getVehicleStatusName(vehicle));
      return AVAILABLE_STATUS_LABELS.has(statusName);
    };

    return vehicles.filter((vehicle) => {
      const statusId = getVehicleStatusId(vehicle);
      if (availableStatusId !== undefined && availableStatusId !== null) {
        return statusId === availableStatusId || availableLabelMatch(vehicle);
      }

      if (statusId !== undefined && statusId !== null) {
        return statusId === 1 || availableLabelMatch(vehicle);
      }

      return availableLabelMatch(vehicle);
    });
  }, [availableStatusId, vehicles]);

  const brandOptions = useMemo(() => {
    const uniqueBrands = new Set();
    availableVehicles.forEach((vehicle) => {
      if (vehicle?.brand) {
        uniqueBrands.add(vehicle.brand);
      }
    });
    return Array.from(uniqueBrands).sort((a, b) => a.localeCompare(b));
  }, [availableVehicles]);

  return {
    vehicles: availableVehicles,
    loading,
    error,
    initialCriteria,
    filters,
    categories,
    statuses,
    brandOptions,
    hasSearched: Boolean(lastCriteria),
    lastCriteria,
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
