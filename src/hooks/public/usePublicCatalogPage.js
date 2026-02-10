import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleService from '../../api/services/VehicleService';
import { MESSAGES, PAGINATION, ROUTES } from '../../constants';
import { buildVehicleFilterFields } from '../../constants/vehicleFilterFields';
import { buildVehicleSearchCriteria } from '../../utils/vehicleSearchCriteria';
import { getVehicleFilterDefaults } from '../../constants/vehicleFilterDefaults';
import { buildReservationState } from '../../constants/reservationNavigation';
import { DEFAULT_AVAILABLE_STATUS_LABELS, getAvailableStatusId } from '../../utils/vehicleStatusUtils';
import useVehicleCategories from '../vehicle/useVehicleCategories';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useHeadquarters from '../location/useHeadquarters';
import { useAuth } from '../core/useAuth';
import { updateFilterValue } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = getVehicleFilterDefaults();

const normalizeCriteria = (criteria, availableStatusId) => Object.assign({}, criteria, {
  pageNumber: criteria.pageNumber ?? PAGINATION.DEFAULT_PAGE,
  pageSize: criteria.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
  vehicleStatusId: availableStatusId ?? criteria.vehicleStatusId
});

const usePublicCatalogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCriteria = location.state?.criteria ?? null;

  const { isAuthenticated } = useAuth();
  const { categories } = useVehicleCategories();
  const { statuses } = useVehicleStatuses();
  const { headquarters } = useHeadquarters();

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

  const searchVehicles = useCallback(async (criteria) => {
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
  }, []);

  const normalizedInitialCriteria = initialCriteria
    ? normalizeCriteria(initialCriteria, availableStatusId)
    : null;
  const lastCriteria = lastCriteriaState ?? normalizedInitialCriteria;

  useEffect(() => {
    if (!normalizedInitialCriteria || lastCriteriaState) {
      return;
    }
    searchVehicles(normalizedInitialCriteria).catch(() => {});
  }, [lastCriteriaState, normalizedInitialCriteria, searchVehicles]);

  const handleSearch = (criteria) => {
    const normalizedCriteria = normalizeCriteria(criteria, availableStatusId);
    setLastCriteria(normalizedCriteria);
    setFilters(DEFAULT_FILTERS);
    searchVehicles(normalizedCriteria).catch(() => {});
  };

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = () => {
    if (!lastCriteria) return;
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

  const handleReserve = (vehicle) => {
    if (!vehicle) return;
    const reservationState = buildReservationState({
      vehicle,
      criteria: lastCriteria || {}
    });

    if (isAuthenticated) {
      navigate(ROUTES.RESERVATION_CREATE, { state: reservationState });
      return;
    }

    navigate(ROUTES.LOGIN, {
      state: {
        redirectTo: ROUTES.RESERVATION_CREATE,
        redirectState: reservationState
      }
    });
  };

  const brandOptions = useMemo(() => {
    const uniqueBrands = new Set();
    vehicles.forEach((vehicle) => {
      if (vehicle?.brand) uniqueBrands.add(vehicle.brand);
    });
    return Array.from(uniqueBrands).sort((a, b) => a.localeCompare(b));
  }, [vehicles]);

  const filterFields = useMemo(() => buildVehicleFilterFields({
    categories,
    statuses,
    headquarters,
    brandOptions,
    includeIdentifiers: false,
    includeStatus: false,
    includeActiveStatus: false,
    includeHeadquarters: true
  }), [brandOptions, categories, headquarters, statuses]);

  return {
    state: {
      vehicles,
      filters,
      selectedVehicleId
    },
    ui: {
      isLoading: loading,
      error
    },
    actions: {
      setSelectedVehicleId,
      handleSearch,
      handleFilterChange,
      applyFilters,
      resetFilters,
      handleCloseDetail: () => setSelectedVehicleId(null),
      handleReserve
    },
    meta: {
      initialCriteria,
      hasSearched: Boolean(lastCriteria),
      filterFields
    }
  };
};

export default usePublicCatalogPage;
