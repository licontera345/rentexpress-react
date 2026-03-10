import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleService from '../../api/services/vehicleService';
import { MESSAGES, ROUTES, PAGINATION, VEHICLE_STATUS } from '../../constants';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { getApiErrorMessage } from '../../utils/ui/uiUtils';
import { buildVehicleFilterFields, getVehicleFilterDefaults } from '../../utils/filter/filterFieldBuilders';
import { buildVehicleSearchCriteria } from '../../utils/vehicle';
import { buildReservationState, toReservationDateTime } from '../../utils/reservation/reservationUtils';
import { normalizeCatalogCriteria } from '../../utils/form/apiFormUtils';
import { getUniqueBrandsFromVehicles } from '../../utils/vehicle';
import useVehicleCategories from '../vehicle/useVehicleCategories';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useHeadquarters from '../location/useHeadquarters';
import useFilterRanges from '../config/useFilterRanges';
import { useAuth } from '../core/useAuth';
import { updateFilterValue, resetFiltersToDefault, startAsyncLoad } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = getVehicleFilterDefaults({ includeYear: false });

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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [lastCriteriaState, setLastCriteria] = useState(null);

  const normalizeCriteria = useCallback(
    (criteria) => {
      const normalized = normalizeCatalogCriteria(criteria);
      const pickupIso = toReservationDateTime(criteria?.pickupDate, criteria?.pickupTime);
      const returnIso = toReservationDateTime(criteria?.returnDate, criteria?.returnTime);
      if (pickupIso && returnIso) {
        normalized.availableFrom = pickupIso;
        normalized.availableTo = returnIso;
      }
      normalized.pageNumber = PAGINATION.DEFAULT_PAGE;
      normalized.pageSize = PAGINATION.CATALOG_FETCH_SIZE;
      // Catálogo público: solo vehículos disponibles
      normalized.vehicleStatusId = VEHICLE_STATUS.AVAILABLE_ID;
      return normalized;
    },
    [],
  );

  const searchVehicles = useCallback(async (criteria) => {
    startAsyncLoad(setLoading, setError);
    try {
      const result = await VehicleService.search(criteria);
      const list = getResultsList(result);
      // Catálogo público: mostrar solo vehículos disponibles (por si el backend no filtra por vehicleStatusId)
      const availableOnly = list.filter(
        (v) => Number(v?.vehicleStatusId ?? v?.vehicleStatus?.vehicleStatusId) === VEHICLE_STATUS.AVAILABLE_ID
      );
      setVehicles(availableOnly);
    } catch (err) {
      setError(getApiErrorMessage(err, 'CATALOG_ERROR_SEARCH'));
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
    const hasPickup = normalizedInitialCriteria.currentHeadquartersId != null && String(normalizedInitialCriteria.currentHeadquartersId).trim() !== '';
    const hasReturn = normalizedInitialCriteria.returnHeadquartersId != null && String(normalizedInitialCriteria.returnHeadquartersId).trim() !== '';
    if (!hasPickup || !hasReturn) return;
    setLastCriteria(normalizedInitialCriteria);
    searchVehicles(normalizedInitialCriteria).catch(() => {});
  }, [lastCriteriaState, normalizedInitialCriteria, searchVehicles]);

  const handleSearch = useCallback((criteria) => {
    const normalized = normalizeCriteria(criteria);
    const hasPickupSede = normalized.currentHeadquartersId != null && String(normalized.currentHeadquartersId).trim() !== '';
    const hasReturnSede = normalized.returnHeadquartersId != null && String(normalized.returnHeadquartersId).trim() !== '';
    if (!hasPickupSede || !hasReturnSede) return;
    setLastCriteria(normalized);
    setCurrentPage(1);
    resetFiltersToDefault(setFilters, DEFAULT_FILTERS);
    searchVehicles(normalized).catch(() => {});
  }, [normalizeCriteria, searchVehicles]);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback((overrideFilters) => {
    if (!lastCriteria) return;
    const f = overrideFilters !== undefined ? overrideFilters : filters;
    if (overrideFilters !== undefined) setFilters(overrideFilters);
    setCurrentPage(1);
    const filteredCriteria = Object.assign(
      {},
      lastCriteria,
      buildVehicleSearchCriteria(f, {
        pageNumber: lastCriteria.pageNumber,
        pageSize: lastCriteria.pageSize,
      })
    );
    searchVehicles(filteredCriteria).catch(() => {});
  }, [lastCriteria, filters, searchVehicles]);

  const resetFilters = useCallback(() => {
    setCurrentPage(1);
    resetFiltersToDefault(setFilters, DEFAULT_FILTERS);
    if (lastCriteria) {
      searchVehicles(lastCriteria).catch(() => {});
    }
  }, [lastCriteria, searchVehicles]);

  const handleReserve = (vehicle) => {
    if (!vehicle) return;
    const reservationState = buildReservationState({
      vehicle,
      criteria: lastCriteria || {},
    });

    if (isAuthenticated) {
      navigate(ROUTES.RESERVATION_CREATE, { state: reservationState, });
      return;
    }

    navigate(ROUTES.LOGIN, {
      state: {
        redirectTo: ROUTES.RESERVATION_CREATE,
        redirectState: reservationState,
      },
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
    includeHeadquarters: true,
    includeYear: false,
    filterRangesFromApi: filterRanges,
  }), [brandOptions, categories, headquarters, statuses, filterRanges]);

  return {
    state: {
      vehicles,
      filters,
      selectedVehicleId,
      currentPage,
    },
    ui: {
      isLoading: loading,
      error,
    },
    actions: {
      setSelectedVehicleId,
      handleSearch,
      handleFilterChange,
      applyFilters,
      resetFilters,
      handleCloseDetail: () => setSelectedVehicleId(null),
      handleReserve,
      setCurrentPage,
    },
    options: {
      initialCriteria,
      hasSearched: Boolean(lastCriteria),
      filterFields,
    },
  };
};

export default usePublicCatalogPage;
