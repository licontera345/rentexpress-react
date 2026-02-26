import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleService from '../../api/services/VehicleService';
import { MESSAGES, ROUTES } from '../../constants';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { buildVehicleFilterFields, getVehicleFilterDefaults } from '../../utils/filter/filterFieldBuilders';
import { buildVehicleSearchCriteria } from '../../utils/vehicle';
import { buildReservationState } from '../../utils/reservation/reservationUtils';
import { normalizeCatalogCriteria } from '../../utils/form/apiFormUtils';
import { getUniqueBrandsFromVehicles } from '../../utils/vehicle';
import useVehicleCategories from '../vehicle/useVehicleCategories';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useHeadquarters from '../location/useHeadquarters';
import useFilterRanges from '../config/useFilterRanges';
import { useAuth } from '../core/useAuth';
import { updateFilterValue, resetFiltersToDefault, startAsyncLoad } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = getVehicleFilterDefaults();

const usePublicCatalogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCriteria = location.state?.criteria ?? null;

  const { isAuthenticated } = useAuth();
  const { categories } = useVehicleCategories();
  const { statuses } = useVehicleStatuses();
  const { headquarters } = useHeadquarters();
  const { filterRanges } = useFilterRanges();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [lastCriteriaState, setLastCriteria] = useState(null);

  // Normaliza los criterios de búsqueda.
  const normalizeCriteria = useCallback(
    (criteria) => normalizeCatalogCriteria(criteria),
    []
  );

  // Busca vehículos con los criterios proporcionados.
  const searchVehicles = useCallback(async (criteria) => {
    startAsyncLoad(setLoading, setError);
    try {
      const result = await VehicleService.search(criteria);
      setVehicles(getResultsList(result));
    } catch (err) {
      setError(err.message || 'Error en la búsqueda');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Normaliza los criterios de búsqueda inicial.
  const normalizedInitialCriteria = useMemo(() => {
    if (!initialCriteria) return null;
    return normalizeCriteria(initialCriteria);
  }, [initialCriteria, normalizeCriteria]);

  const lastCriteria = lastCriteriaState ?? normalizedInitialCriteria;

  // Busca vehículos con los criterios iniciales.
  useEffect(() => {
    if (!normalizedInitialCriteria || lastCriteriaState) {
      return;
    }
    setLastCriteria(normalizedInitialCriteria);
    searchVehicles(normalizedInitialCriteria).catch(() => {});
  }, [lastCriteriaState, normalizedInitialCriteria, searchVehicles]);

  // Manejador de búsqueda.
  const handleSearch = useCallback((criteria) => {
    const normalized = normalizeCriteria(criteria);
    setLastCriteria(normalized);
    resetFiltersToDefault(setFilters, DEFAULT_FILTERS);
    searchVehicles(normalized).catch(() => {});
  }, [normalizeCriteria, searchVehicles]);

  // Manejador de cambios en los filtros.
  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  // Aplica los filtros a la búsqueda.
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

  // Resetea los filtros y busca vehículos con los criterios iniciales.
  const resetFilters = useCallback(() => {
    resetFiltersToDefault(setFilters, DEFAULT_FILTERS);
    if (lastCriteria) {
      searchVehicles(lastCriteria).catch(() => {});
    }
  }, [lastCriteria, searchVehicles]);

  // Manejador de reserva.
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

  // Opciones de marcas para los selects.
  const brandOptions = useMemo(() => getUniqueBrandsFromVehicles(vehicles), [vehicles]);

  const filterFields = useMemo(() => buildVehicleFilterFields({
    categories,
    statuses,
    headquarters,
    brandOptions,
    includeIdentifiers: false,
    includeStatus: false,
    includeActiveStatus: false,
    includeHeadquarters: true,
    filterRangesFromApi: filterRanges,
  }), [brandOptions, categories, headquarters, statuses, filterRanges]);

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
    options: {
      initialCriteria,
      hasSearched: Boolean(lastCriteria),
      filterFields
    }
  };
};

export default usePublicCatalogPage;
