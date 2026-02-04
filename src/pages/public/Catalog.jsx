import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/vehicle/modals/VehicleDetailModal';
import CatalogResults from '../../components/vehicle/catalog/CatalogResults';
import VehicleFilters from '../../components/vehicle/filters/VehicleFilters';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import useCatalogPage from '../../hooks/useCatalogPage';
import { useAuth } from '../../hooks/useAuth';
import useHeadquarters from '../../hooks/useHeadquarters';
import { MESSAGES, ROUTES } from '../../constants';
import { buildVehicleFilterFields } from '../../config/vehicleFilterFields';

// Página pública del catálogo con búsqueda, filtros y detalle de vehículos. Centraliza criterios y navegación de reservas.
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

  // Maneja la reserva: si no hay sesión, redirige al login con estado de reserva.
  const handleReserve = useCallback((vehicle) => {
    if (!vehicle) return;
    const criteria = lastCriteria || {};
    const reservationState = {
      vehicleId: vehicle.vehicleId ?? vehicle.id,
      dailyPrice: vehicle.dailyPrice,
      vehicleSummary: {
        brand: vehicle.brand,
        model: vehicle.model,
        licensePlate: vehicle.licensePlate,
        manufactureYear: vehicle.manufactureYear,
        currentMileage: vehicle.currentMileage
      },
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

  const handleAdvisorOpen = useCallback(() => {
    if (!vehicles || vehicles.length === 0) {
      return;
    }

    sessionStorage.setItem('ai_advisor_vehicles', JSON.stringify(vehicles));

    if (isAuthenticated) {
      navigate(ROUTES.AI_ADVISOR);
      return;
    }

    navigate(ROUTES.LOGIN, {
      state: {
        redirectTo: ROUTES.AI_ADVISOR
      }
    });
  }, [isAuthenticated, navigate, vehicles]);

  // Construye los campos disponibles para el panel de filtros.
  const filterFields = buildVehicleFilterFields({
    categories,
    statuses,
    headquarters,
    brandOptions,
    includeIdentifiers: false,
    includeStatus: false,
    includeActiveStatus: false,
    includeHeadquarters: true
  });

  return (
    <PublicLayout>
      {/* Encabezado accesible para lectores de pantalla */}
      <h1 className="sr-only">{MESSAGES.NAV_CATALOG}</h1>
      <section className="catalog-section">
        <div className="catalog-container">
          {/* Panel de búsqueda principal */}
          <div className="catalog-search-wrapper">
            <SearchPanel
              onSearch={handleSearch}
              initialCriteria={initialCriteria}
              variant="hero"
              className="catalog-search-panel"
            />
          </div>

          {hasSearched && (
            <div className="catalog-content">
              {/* Barra lateral con filtros */}
              <aside className="catalog-filters-sidebar">
                <VehicleFilters
                  fields={filterFields}
                  values={filters}
                  onChange={handleFilterChange}
                  onApply={applyFilters}
                  onReset={resetFilters}
                  className="catalog-filters"
                  isLoading={loading}
                />
              </aside>

              <div className="catalog-results-area">
                {/* Resultados y estado de carga */}
                {loading && <LoadingSpinner message="Cargando..." />}

                {!loading && !error && (
                  <CatalogResults 
                    vehicles={vehicles} 
                    onVehicleClick={setSelectedVehicleId}
                    onReserve={handleReserve}
                    onAdvisorClick={handleAdvisorOpen}
                  />
                )}
              </div>
            </div>
          )}

          {!hasSearched && loading && <LoadingSpinner message="Cargando..." />}

          {!hasSearched && !loading && !error && (
            <CatalogResults 
              vehicles={vehicles} 
              onVehicleClick={setSelectedVehicleId}
              onReserve={handleReserve}
              onAdvisorClick={handleAdvisorOpen}
            />
          )}
        </div>

        {/* Modal para ver detalles y confirmar reserva */}
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
