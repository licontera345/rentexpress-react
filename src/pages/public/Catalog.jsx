import { useRef } from 'react';
import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/vehicle/modals/VehicleDetailModal';
import CatalogResults from '../../components/vehicle/catalog/CatalogResults';
import FilterPanel from '../../components/common/filters/FilterPanel';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import usePublicCatalogPage from '../../hooks/public/usePublicCatalogPage';
import useSearchPanel from '../../hooks/public/useSearchPanel';
import useVehicleDetailData from '../../hooks/vehicle/useVehicleDetailData';
import useModalFocus from '../../hooks/core/useModalFocus';
import { MESSAGES } from '../../constants';

function Catalog() {
  const { state, ui, actions, options } = usePublicCatalogPage();
  const searchPanelProps = useSearchPanel(options.initialCriteria, actions.handleSearch, 'hero', 'catalog-search-panel');
  const detailData = useVehicleDetailData(state.selectedVehicleId);
  const dialogRef = useRef(null);
  useModalFocus({
    isOpen: Boolean(state.selectedVehicleId),
    onClose: actions.handleCloseDetail,
    dialogRef
  });

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
            <SearchPanel {...searchPanelProps} />
          </div>

          {options.hasSearched && (
            <div className="catalog-content">
              <aside className="catalog-filters-sidebar">
                <FilterPanel
                  fields={options.filterFields}
                  values={state.filters}
                  onChange={actions.handleFilterChange}
                  onApply={actions.applyFilters}
                  onReset={actions.resetFilters}
                  className="catalog-filters"
                  isLoading={ui.isLoading}
                />
              </aside>

              <div className="catalog-results-area">
                {ui.isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}
                {!ui.isLoading && !ui.error && resultsContent}
              </div>
            </div>
          )}

          {!options.hasSearched && ui.isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}
          {!options.hasSearched && !ui.isLoading && !ui.error && resultsContent}
        </div>

        <VehicleDetailModal
          vehicleId={state.selectedVehicleId}
          formattedVehicle={detailData.formattedVehicle}
          loading={detailData.loading}
          error={detailData.error}
          imageSrc={detailData.imageSrc}
          hasImage={detailData.hasImage}
          vehicle={detailData.vehicle}
          dialogRef={dialogRef}
          onClose={actions.handleCloseDetail}
          onReserve={actions.handleReserve}
        />
      </section>
    </PublicLayout>
  );
}

export default Catalog;
