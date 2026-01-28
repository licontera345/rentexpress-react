import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/common/modal/VehicleDetailModal';
import CatalogResults from '../../components/common/catalog/CatalogResults';
import VehicleFilters from '../../components/common/filters/VehicleFilters';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import useCatalogPage from '../../hooks/useCatalogPage';
import { useAuth } from '../../hooks/useAuth';
import useHeadquarters from '../../hooks/useHeadquarters';
import { MESSAGES, ROUTES } from '../../constants';
import { buildVehicleFilterFields } from '../../utils/vehicleFilterFields';

function Catalog() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    vehicles,
    loading,
    error,
    initialCriteria,
    filters,
    categories,
    statuses,
    brandOptions,
    hasSearched,
    lastCriteria,
    selectedVehicleId,
    setSelectedVehicleId,
    handleSearch,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handleCloseDetail
  } = useCatalogPage();
  const { headquarters } = useHeadquarters();

  const handleReserve = useCallback((vehicle) => {
    if (!vehicle) return;
    const criteria = lastCriteria || {};
    const reservationState = {
      vehicleId: vehicle.vehicleId ?? vehicle.id,
      dailyPrice: vehicle.dailyPrice,
      currentHeadquartersId: vehicle.currentHeadquartersId ?? vehicle.headquartersId,
      pickupHeadquartersId: criteria.currentHeadquartersId ?? criteria.pickupHeadquartersId ?? '',
      returnHeadquartersId: criteria.returnHeadquartersId ?? '',
      pickupDate: criteria.pickupDate ?? '',
      pickupTime: criteria.pickupTime ?? '',
      returnDate: criteria.returnDate ?? '',
      returnTime: criteria.returnTime ?? ''
    };

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
  }, [isAuthenticated, lastCriteria, navigate]);

  const headquartersOptions = headquarters.map((hq) => ({
    value: hq.headquartersId ?? hq.id,
    label: hq.headquartersName ?? hq.name
  }));

  const filterFields = buildVehicleFilterFields({
    categories,
    statuses,
    headquartersOptions,
    brandOptions,
    includeIdentifiers: false,
    includeStatus: false,
    includeActiveStatus: false,
    includeHeadquarters: true
  });

  return (
    <PublicLayout>
      <h1 className="sr-only">{MESSAGES.NAV_CATALOG}</h1>
      <section className="catalog-section">
        <div className="catalog-container">
          <div className="catalog-search-wrapper">
            <SearchPanel
              onSearch={handleSearch}
              initialCriteria={initialCriteria}
              variant="hero"
              className="catalog-search-panel"
            />
          </div>

          {hasSearched && (
            <VehicleFilters
              fields={filterFields}
              values={filters}
              onChange={handleFilterChange}
              onApply={applyFilters}
              onReset={resetFilters}
              className="catalog-filters"
              isLoading={loading}
            />
          )}

          {loading && <LoadingSpinner message="Cargando..." />}

          {!loading && !error && (
            <CatalogResults 
              vehicles={vehicles} 
              onVehicleClick={setSelectedVehicleId}
              onReserve={handleReserve}
            />
          )}
        </div>

        <VehicleDetailModal 
          vehicleId={selectedVehicleId} 
          onClose={handleCloseDetail}
          onReserve={handleReserve}
        />
      </section>
    </PublicLayout>
  );
}

export default Catalog;
