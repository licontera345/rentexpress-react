import VehicleCard from '../cards/VehicleCard';
import Pagination from '../../common/navigation/Pagination';
import EmptyState from '../../common/feedback/EmptyState';
import { MESSAGES, PAGINATION } from '../../../constants';
import { scrollToTop } from '../../../utils/ui/uiUtils';

// Componente CatalogResults que define la interfaz y organiza la lógica de esta vista.

function CatalogResults({
  vehicles = [],
  onVehicleClick,
  onReserve,
  resultsCount,
  pagination,
  variant
}) {
  if (vehicles.length === 0) {
    return (
      <EmptyState 
        title={MESSAGES.EMPTY_RESULTS}
        description={MESSAGES.NO_VEHICLES_FOUND}
      />
    );
  }

  const handlePageChange = (newPage) => {
    if (pagination?.onPageChange) {
      pagination.onPageChange(newPage);
    }
    scrollToTop();
  };

  const totalResults = resultsCount || vehicles.length;
  const showPagination = pagination?.totalPages > 1;
  const isCatalog = variant === 'catalog';

  return (
    <div className={isCatalog ? 'catalog-results-container' : 'catalog-results-container'}>
      <div className={isCatalog ? 'catalog-results-bar' : 'results-header'}>
        <div className={isCatalog ? 'catalog-results-bar-left' : 'results-title-group'}>
          {isCatalog ? (
            <>
              <span className="catalog-results-title">{MESSAGES.RESULTS_TITLE}</span>
              <span className="catalog-results-count">{totalResults} {MESSAGES.VEHICLES_PLURAL}</span>
            </>
          ) : (
            <>
              <h2>{MESSAGES.RESULTS_TITLE}</h2>
              <span className="results-count-badge">{totalResults}</span>
            </>
          )}
        </div>
      </div>
      
      <div className={isCatalog ? 'catalog-vehicle-grid' : 'vehicle-grid'}>
        {vehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle.vehicleId} 
            vehicle={vehicle} 
            onClick={() => onVehicleClick(vehicle.vehicleId)}
            onReserve={onReserve}
            variant={isCatalog ? 'catalog' : undefined}
          />
        ))}
      </div>

      {showPagination && (
        <Pagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          maxButtons={PAGINATION.MAX_BUTTONS}
          variant={isCatalog ? 'catalog' : undefined}
        />
      )}
    </div>
  );
}

export default CatalogResults;
