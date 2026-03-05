import { Navigate } from 'react-router-dom';
import { useRef, useMemo } from 'react';
import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/vehicle/modals/VehicleDetailModal';
import CatalogResults from '../../components/vehicle/catalog/CatalogResults';
import VehicleRecommendationPanel from '../../components/vehicle/catalog/VehicleRecommendationPanel';
import FilterPanel from '../../components/common/filters/FilterPanel';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import usePublicCatalogPage from '../../hooks/public/usePublicCatalogPage';
import useSearchPanel from '../../hooks/public/useSearchPanel';
import useVehicleDetailData from '../../hooks/vehicle/useVehicleDetailData';
import useVehicleRecommendation from '../../hooks/public/useVehicleRecommendation';
import useModalFocus from '../../hooks/core/useModalFocus';
import { useAuth } from '../../hooks/core/useAuth';
import { MESSAGES, ROUTES, USER_ROLES, PAGINATION } from '../../constants';

function Catalog() {
  const { sessionReady, role } = useAuth();
  const { state, ui, actions, options } = usePublicCatalogPage();
  const searchPanelProps = useSearchPanel(options.initialCriteria, actions.handleSearch, 'hero', 'catalog-search-panel');
  const detailData = useVehicleDetailData(state.selectedVehicleId);
  const recommendation = useVehicleRecommendation(state.vehicles);
  const dialogRef = useRef(null);
  useModalFocus({
    isOpen: Boolean(state.selectedVehicleId),
    onClose: actions.handleCloseDetail,
    dialogRef
  });

  if (sessionReady && role === USER_ROLES.EMPLOYEE) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const sortedVehicles = recommendation.hasResult && recommendation.recommendedIds.length > 0
    ? [
        ...state.vehicles.filter((v) => recommendation.recommendedIds.includes(v.vehicleId)),
        ...state.vehicles.filter((v) => !recommendation.recommendedIds.includes(v.vehicleId)),
      ]
    : state.vehicles;

  const pageSize = PAGINATION.CATALOG_PAGE_SIZE;
  const totalCount = sortedVehicles.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(state.currentPage, totalPages);
  const paginatedVehicles = useMemo(
    () => sortedVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedVehicles, currentPage, pageSize],
  );

  const pagination = totalPages <= 1 ? null : {
    pageNumber: currentPage,
    totalPages,
    onPageChange: actions.setCurrentPage,
  };

  const resultsContent = (
    <CatalogResults
      vehicles={paginatedVehicles.map((v) => ({
        ...v,
        isRecommended: recommendation.recommendedIds.includes(v.vehicleId),
      }))}
      resultsCount={totalCount}
      pagination={pagination}
      onVehicleClick={actions.setSelectedVehicleId}
      onReserve={actions.handleReserve}
      variant="catalog"
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

        {options.hasSearched ? (
          <div className="catalog-page-layout">
            <aside className="catalog-filters-sidebar">
              <FilterPanel
                fields={options.filterFields}
                values={state.filters}
                onChange={actions.handleFilterChange}
                onApply={actions.applyFilters}
                onReset={actions.resetFilters}
                variant="catalog"
                isLoading={ui.isLoading}
              />
            </aside>
            <div className="catalog-results-area">
              {ui.isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}
              {!ui.isLoading && !ui.error && resultsContent}
            </div>
            {state.vehicles.length > 0 ? (
              <div className="catalog-rec-panel-wrap">
                <VehicleRecommendationPanel
                  preferences={recommendation.preferences}
                  setPreference={recommendation.setPreference}
                  isComplete={recommendation.isComplete}
                  explanation={recommendation.explanation}
                  loading={recommendation.loading}
                  error={recommendation.error}
                  hasResult={recommendation.hasResult}
                  onSubmit={recommendation.submit}
                  onReset={recommendation.reset}
                  disabled={ui.isLoading}
                  variant="banner"
                />
              </div>
            ) : (
              <div className="catalog-rec-panel-wrap catalog-rec-panel-wrap--empty" aria-hidden />
            )}
          </div>
        ) : (
          <>
            {ui.isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}
            {!ui.isLoading && !ui.error && (
              <div className="catalog-page-layout">
                <div className="catalog-results-area" style={{ gridColumn: '1 / -1' }}>
                  {resultsContent}
                </div>
              </div>
            )}
          </>
        )}

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
          showYear={false}
        />
      </section>
    </PublicLayout>
  );
}

export default Catalog;
