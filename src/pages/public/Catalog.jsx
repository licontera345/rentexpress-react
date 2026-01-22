import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/common/modal/VehicleDetailModal';
import CatalogResults from '../../components/common/catalog/CatalogResults';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import useCatalogPage from '../../hooks/useCatalogPage';
import { MESSAGES } from '../../constants';

function Catalog() {
  const {
    vehicles,
    loading,
    error,
    initialCriteria,
    selectedVehicleId,
    setSelectedVehicleId,
    handleSearch,
    handleCloseDetail
  } = useCatalogPage();

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

          {loading && <LoadingSpinner message="Cargando..." />}

          {!loading && !error && (
            <CatalogResults 
              vehicles={vehicles} 
              onVehicleClick={setSelectedVehicleId}
            />
          )}
        </div>

        <VehicleDetailModal 
          vehicleId={selectedVehicleId} 
          onClose={handleCloseDetail} 
        />
      </section>
    </PublicLayout>
  );
}

export default Catalog;
