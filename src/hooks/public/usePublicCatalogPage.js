import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleService from '../../api/services/VehicleService';
import { MESSAGES, ROUTES } from '../../constants';
import { buildVehicleFilterFields, getVehicleFilterDefaults } from '../../constants/vehicleFilterFields';
import { buildVehicleSearchCriteria } from '../../utils/vehicleSearchCriteria';
import { buildReservationState } from '../../utils/reservationFormUtils';
import { normalizeCatalogCriteria } from '../../utils/apiFormUtils';
import { getUniqueBrandsFromVehicles } from '../../utils/vehicleUtils';
import useVehicleCategories from '../vehicle/useVehicleCategories';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useHeadquarters from '../location/useHeadquarters';
import { useAuth } from '../core/useAuth';
import { updateFilterValue } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = getVehicleFilterDefaults();

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

  const normalizeCriteria = useCallback(
    (criteria) => normalizeCatalogCriteria(criteria),
    []
  );

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

  const normalizedInitialCriteria = useMemo(() => {
    if (!initialCriteria) return null;
    return normalizeCriteria(initialCriteria);
  }, [initialCriteria, normalizeCriteria]);

  const lastCriteria = lastCriteriaState ?? normalizedInitialCriteria;

  useEffect(() => {
    if (!normalizedInitialCriteria || lastCriteriaState) {
      return;
    }
    setLastCriteria(normalizedInitialCriteria);
    searchVehicles(normalizedInitialCriteria).catch(() => {});
  }, [lastCriteriaState, normalizedInitialCriteria, searchVehicles]);

  const handleSearch = useCallback((criteria) => {
    const normalized = normalizeCriteria(criteria);
    setLastCriteria(normalized);
    setFilters(DEFAULT_FILTERS);
    searchVehicles(normalized).catch(() => {});
  }, [normalizeCriteria, searchVehicles]);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback(() => {
    if (!lastCriteria) return;
    const filteredCriteria = Object.assign(
      {},
      lastCriteria,
      buildVehicleSearchCriteria(filters, {
        pageNumber: lastCriteria.pageNumber,
        pageSize: lastCriteria.pageSize
      })
    );
    searchVehicles(filteredCriteria).catch(() => {});
  }, [lastCriteria, filters, searchVehicles]);

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

  const brandOptions = useMemo(() => getUniqueBrandsFromVehicles(vehicles), [vehicles]);

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
