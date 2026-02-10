import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/vehicle/modals/VehicleDetailModal';
import CatalogResults from '../../components/vehicle/catalog/CatalogResults';
import FilterPanel from '../../components/common/filters/FilterPanel';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import usePublicCatalogPage from '../../hooks/public/usePublicCatalogPage';
import { MESSAGES } from '../../constants';

function Catalog() {
  const { state, ui, actions, meta } = usePublicCatalogPage();

  const resultsContent = (
    <CatalogResults
      vehicles={state.vehicles}
      onVehicleClick={actions.setSelectedVehicleId}
      onReserve={actions.handleReserve}
    />
  );

  return (
    <PublicLayout>
      <h1 className="sr-only">{MESSAGES.NAV_CATALOG}</h1>
      <section className="catalog-section">
        <div className="catalog-container">
          <div className="catalog-search-wrapper">
            <SearchPanel
              onSearch={actions.handleSearch}
              initialCriteria={meta.initialCriteria}
              variant="hero"
              className="catalog-search-panel"
            />
          </div>

          {meta.hasSearched && (
            <div className="catalog-content">
              <aside className="catalog-filters-sidebar">
                <FilterPanel
                  fields={meta.filterFields}
                  values={state.filters}
                  onChange={actions.handleFilterChange}
                  onApply={actions.applyFilters}
                  onReset={actions.resetFilters}
                  className="catalog-filters"
                  isLoading={ui.isLoading}
                />
              </aside>

              <div className="catalog-results-area">
                {ui.isLoading && <LoadingSpinner message="Cargando..." />}
                {!ui.isLoading && !ui.error && resultsContent}
              </div>
            </div>
          )}

          {!meta.hasSearched && ui.isLoading && <LoadingSpinner message="Cargando..." />}
          {!meta.hasSearched && !ui.isLoading && !ui.error && resultsContent}
        </div>

        <VehicleDetailModal
          vehicleId={state.selectedVehicleId}
          onClose={actions.handleCloseDetail}
          onReserve={actions.handleReserve}
        />
      </section>
    </PublicLayout>
  );
}

export default Catalog;
