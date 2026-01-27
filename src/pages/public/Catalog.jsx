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
import { MESSAGES, ROUTES } from '../../constants';

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

  const filterFields = [
    {
      name: 'brand',
      label: MESSAGES.BRAND,
      type: 'text',
      placeholder: MESSAGES.PLACEHOLDER_BRAND,
      datalist: brandOptions
    },
    {
      name: 'categoryId',
      label: MESSAGES.CATEGORY,
      type: 'select',
      placeholder: MESSAGES.ALL_CATEGORIES,
      options: categories.map((category) => ({
        value: category.categoryId ?? category.id,
        label: category.categoryName ?? category.name
      }))
    },
    {
      name: 'minPrice',
      label: MESSAGES.MIN_PRICE,
      type: 'number',
      placeholder: MESSAGES.MIN_PLACEHOLDER,
      min: 0,
      step: 0.01
    },
    {
      name: 'maxPrice',
      label: MESSAGES.MAX_PRICE,
      type: 'number',
      placeholder: MESSAGES.MAX_PLACEHOLDER,
      min: 0,
      step: 0.01
    },
    {
      name: 'manufactureYearFrom',
      label: `${MESSAGES.YEAR} ${MESSAGES.FROM}`,
      type: 'number',
      placeholder: MESSAGES.YEAR_FROM,
      min: 1900,
      step: 1
    },
    {
      name: 'manufactureYearTo',
      label: `${MESSAGES.YEAR} ${MESSAGES.TO}`,
      type: 'number',
      placeholder: MESSAGES.YEAR_TO,
      min: 1900,
      step: 1
    },
    {
      name: 'currentMileageMin',
      label: `${MESSAGES.MILEAGE} ${MESSAGES.FROM}`,
      type: 'number',
      placeholder: MESSAGES.MIN_PLACEHOLDER,
      min: 0,
      step: 1
    },
    {
      name: 'currentMileageMax',
      label: `${MESSAGES.MILEAGE} ${MESSAGES.TO}`,
      type: 'number',
      placeholder: MESSAGES.MAX_PLACEHOLDER,
      min: 0,
      step: 1
    }
  ];

  if (statuses.length > 0) {
    filterFields.splice(2, 0, {
      name: 'vehicleStatusId',
      label: MESSAGES.STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL_STATUSES,
      options: statuses.map((status) => ({
        value: status.vehicleStatusId ?? status.id,
        label: status.statusName ?? status.name
      }))
    });
  }

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
