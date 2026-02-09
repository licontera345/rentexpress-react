import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useVehicleSearch from './useVehicleSearch';
import { MESSAGES, PAGINATION } from '../constants';
import { buildVehicleSearchCriteria } from '../config/vehicleSearchCriteria';
import { getVehicleFilterDefaults } from '../config/vehicleFilterDefaults';
import { DEFAULT_AVAILABLE_STATUS_LABELS, getAvailableStatusId } from '../config/vehicleStatusUtils';
import useVehicleFilterOptions from './useVehicleFilterOptions';

/**
 * Hook principal del catálogo de vehículos.
 * Orquesta búsqueda, filtros, selección del vehículo y carga de catálogos auxiliares.
 */
// Valores por defecto de filtros para el catálogo.
const DEFAULT_FILTERS = getVehicleFilterDefaults();

// Hook que centraliza la lógica de búsqueda, filtros y selección del catálogo.
const useCatalogPage = () => {
  const location = useLocation();
  const { vehicles, loading, error, searchVehicles } = useVehicleSearch();
  const { categories, statuses } = useVehicleFilterOptions();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [lastCriteriaState, setLastCriteria] = useState(null);
  const initialCriteria = useMemo(() => location.state?.criteria ?? null, [location.state]);
  const availableStatusId = useMemo(() => (
    getAvailableStatusId(statuses, [MESSAGES.AVAILABLE, ...DEFAULT_AVAILABLE_STATUS_LABELS])
  ), [statuses]);
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

  return {
    vehicles,
    loading,
    error,
    initialCriteria,
    filters,
    categories,
    statuses,
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
