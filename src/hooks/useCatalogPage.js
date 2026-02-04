import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useVehicleSearch from './useVehicleSearch';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import VehicleStatusService from '../api/services/VehicleStatusService';
import { MESSAGES, PAGINATION } from '../constants';
import { buildVehicleSearchCriteria } from '../config/vehicleSearchCriteria';
import { getVehicleFilterDefaults } from '../config/vehicleFilterDefaults';
import useLocale from './useLocale';

// Valores por defecto de filtros para el catálogo.
const DEFAULT_FILTERS = getVehicleFilterDefaults();

// Etiquetas consideradas como "disponible" en distintos idiomas.
const AVAILABLE_STATUS_LABELS = new Set([
  'available',
  'disponible',
  MESSAGES.AVAILABLE?.toLowerCase()
].filter(Boolean));

// Normaliza un valor de estado para comparar sin acentos ni mayúsculas.
const normalizeStatusValue = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : ''
);

// Hook que centraliza la lógica de búsqueda, filtros y selección del catálogo.
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

    // Completa criterios iniciales con paginación y estado disponible si aplica.
    return Object.assign({}, initialCriteria, {
      pageNumber: initialCriteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
      pageSize: initialCriteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
      vehicleStatusId: availableStatusId ?? initialCriteria.vehicleStatusId
    });
  }, [availableStatusId, initialCriteria]);
  const lastCriteria = lastCriteriaState ?? normalizedInitialCriteria;

  useEffect(() => {
    if (normalizedInitialCriteria && !lastCriteriaState) {
      // Ejecuta la búsqueda inicial si viene criteria desde navegación.
      searchVehicles(normalizedInitialCriteria).catch(() => {});
    }
  }, [lastCriteriaState, normalizedInitialCriteria, searchVehicles]);

  useEffect(() => {
    // Carga datos de filtros (categorías y estados) según el locale.
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
    // Normaliza criterios del formulario antes de buscar.
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
    // Mantiene los filtros sincronizados con el formulario.
    setFilters((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(() => {
    if (!lastCriteria) {
      return;
    }

    // Combina los criterios de la última búsqueda con los filtros activos.
    const filteredCriteria = Object.assign(
      {},
      lastCriteria,
      buildVehicleSearchCriteria(filters, {
        pageNumber: lastCriteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
        pageSize: lastCriteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE
      }),
      {
        vehicleStatusId: availableStatusId ?? lastCriteria.vehicleStatusId
      }
    );
    searchVehicles(filteredCriteria).catch(() => {});
  }, [availableStatusId, filters, lastCriteria, searchVehicles]);

  const resetFilters = useCallback(() => {
    // Restaura filtros y vuelve a ejecutar la última búsqueda.
    setFilters(DEFAULT_FILTERS);
    if (lastCriteria) {
      searchVehicles(lastCriteria).catch(() => {});
    }
  }, [lastCriteria, searchVehicles]);

  const handleCloseDetail = useCallback(() => {
    // Cierra el modal de detalle del vehículo.
    setSelectedVehicleId(null);
  }, []);

  const brandOptions = useMemo(() => {
    // Construye opciones de marcas únicas a partir de los resultados.
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
