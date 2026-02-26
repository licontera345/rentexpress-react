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
  pagination
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

  return (
    <div className="catalog-results-container">
      <div className="results-header">
        <div className="results-title-group">
          <h2>{MESSAGES.RESULTS_TITLE}</h2>
          <span className="results-count-badge">{totalResults}</span>
        </div>
      </div>
      
      <div className="vehicle-grid">
        {vehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle.vehicleId} 
            vehicle={vehicle} 
            onClick={() => onVehicleClick(vehicle.vehicleId)}
            onReserve={onReserve}
          />
        ))}
      </div>

      {showPagination && (
        <Pagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          maxButtons={PAGINATION.MAX_BUTTONS}
        />
      )}
    </div>
  );
}

export default CatalogResults;
