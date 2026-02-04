import { useCallback, useEffect, useMemo, useState } from 'react';
import VehicleService from '../api/services/VehicleService';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import VehicleStatusService from '../api/services/VehicleStatusService';
import { MESSAGES, PAGINATION } from '../constants';
import { buildVehicleFilterFields } from '../config/vehicleFilterFields';
import { buildVehicleSearchCriteria } from '../config/vehicleSearchCriteria';
import { getVehicleFilterDefaults } from '../config/vehicleFilterDefaults';
import useLocale from './useLocale';

/**
 * Hook del listado de vehículos para empleados.
 * Controla filtros, paginación y carga de catálogos auxiliares (categorías/estados).
 */
// Filtros por defecto para el listado de vehículos del panel de empleados.
const DEFAULT_FILTERS = getVehicleFilterDefaults({
  includeIdentifiers: true,
  includeStatus: true,
  includeActiveStatus: true
});

// Construye criterios completos de búsqueda según filtros y paginación.
const buildCriteria = (filters, pageNumber) => buildVehicleSearchCriteria(filters, {
  includeIdentifiers: true,
  includeStatus: true,
  includeActiveStatus: true,
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});

// Hook que gestiona el listado de vehículos con filtros, paginación y catálogos.
const useEmployeeVehicleList = ({ headquarters = [] } = {}) => {
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
    // Ejecuta la consulta al backend con criterios normalizados.
    setLoading(true);
    setError(null);

    try {
      const criteria = buildCriteria(nextFilters, pageNumber);
      const response = await VehicleService.search(criteria);
      const results = response?.results || response || [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / criteria.pageSize));

      // Guarda resultados y estado de paginación.
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
    // Carga inicial de vehículos.
    loadVehicles({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadVehicles]);

  useEffect(() => {
    // Obtiene catálogos auxiliares (categorías y estados).
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
    // Actualiza los filtros desde los campos del formulario.
    setFilters((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(() => {
    // Aplica los filtros actuales y reinicia la paginación.
    loadVehicles({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadVehicles]);

  const resetFilters = useCallback(() => {
    // Restaura filtros por defecto y recarga resultados.
    setFilters(DEFAULT_FILTERS);
    loadVehicles({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadVehicles]);

  const handlePageChange = useCallback((nextPage) => {
    // Cambia de página preservando filtros.
    loadVehicles({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadVehicles]);

  const filterFields = useMemo(() => (
    // Define los campos de filtros disponibles en el UI.
    buildVehicleFilterFields({
      categories,
      statuses,
      headquarters,
      includeIdentifiers: true,
      includeStatus: true,
      includeActiveStatus: true,
      includeHeadquarters: true
    })
  ), [categories, headquarters, statuses]);

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
