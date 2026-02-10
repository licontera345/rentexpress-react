import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VehicleService from '../api/services/VehicleService';
import { MESSAGES, PAGINATION } from '../constants';
import { buildVehicleSearchCriteria } from '../config/vehicleSearchCriteria';
import { getVehicleFilterDefaults } from '../config/vehicleFilterDefaults';
import { DEFAULT_AVAILABLE_STATUS_LABELS, getAvailableStatusId } from '../config/vehicleStatusUtils';
import useVehicleCategories from './useVehicleCategories';
import useVehicleStatuses from './useVehicleStatuses';

const DEFAULT_FILTERS = getVehicleFilterDefaults();

const normalizeCriteria = (criteria, availableStatusId) => Object.assign({}, criteria, {
  pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
  pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
  vehicleStatusId: availableStatusId ?? criteria.vehicleStatusId
});

const useCatalogPage = () => {
  const location = useLocation();
  const initialCriteria = location.state?.criteria ?? null;

  const { categories } = useVehicleCategories();
  const { statuses } = useVehicleStatuses();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [lastCriteriaState, setLastCriteria] = useState(null);

  const availableStatusId = getAvailableStatusId(statuses, [
    MESSAGES.AVAILABLE,
    ...DEFAULT_AVAILABLE_STATUS_LABELS
  ]);

  const searchVehicles = async (criteria) => {
    setLoading(true);
    setError(null);

    try {
      const result = await VehicleService.search(criteria);
      setVehicles(result?.results || []);
    } catch (err) {
      setError(err.message || 'Error en la búsqueda');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizedInitialCriteria = initialCriteria
    ? normalizeCriteria(initialCriteria, availableStatusId)
    : null;
  const lastCriteria = lastCriteriaState ?? normalizedInitialCriteria;

  useEffect(() => {
    if (!normalizedInitialCriteria || lastCriteriaState) {
      return;
    }

    searchVehicles(normalizedInitialCriteria).catch(() => {});
  }, [lastCriteriaState, normalizedInitialCriteria]);

  const handleSearch = (criteria) => {
    const normalizedCriteria = normalizeCriteria(criteria, availableStatusId);
    setLastCriteria(normalizedCriteria);
    setFilters(DEFAULT_FILTERS);
    searchVehicles(normalizedCriteria).catch(() => {});
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => Object.assign({}, prev, { [name]: value }));
  };

  const applyFilters = () => {
    if (!lastCriteria) {
      return;
    }

    const filteredCriteria = Object.assign(
      {},
      lastCriteria,
      buildVehicleSearchCriteria(filters, {
        pageNumber: lastCriteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
        pageSize: lastCriteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE
      }),
      { vehicleStatusId: availableStatusId ?? lastCriteria.vehicleStatusId }
    );

    searchVehicles(filteredCriteria).catch(() => {});
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    if (lastCriteria) {
      searchVehicles(lastCriteria).catch(() => {});
    }
  };

  const handleCloseDetail = () => {
    setSelectedVehicleId(null);
  };

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
