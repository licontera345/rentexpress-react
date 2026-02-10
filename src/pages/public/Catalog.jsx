import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/vehicle/modals/VehicleDetailModal';
import CatalogResults from '../../components/vehicle/catalog/CatalogResults';
import FilterPanel from '../../components/common/filters/FilterPanel';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import usePublicCatalogPage from '../../hooks/usePublicCatalogPage';
import { MESSAGES } from '../../constants';

function Catalog() {
  const {
    vehicles,
    loading,
    error,
    initialCriteria,
    filters,
    hasSearched,
    selectedVehicleId,
    setSelectedVehicleId,
    handleSearch,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handleCloseDetail,
    handleReserve,
    filterFields
  } = usePublicCatalogPage();

  const resultsContent = (
    <CatalogResults
      vehicles={vehicles}
      onVehicleClick={setSelectedVehicleId}
      onReserve={handleReserve}
    />
  );

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
            <div className="catalog-content">
              <aside className="catalog-filters-sidebar">
                <FilterPanel
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
                {loading && <LoadingSpinner message="Cargando..." />}
                {!loading && !error && resultsContent}
              </div>
            </div>
          )}

          {!hasSearched && loading && <LoadingSpinner message="Cargando..." />}
          {!hasSearched && !loading && !error && resultsContent}
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
