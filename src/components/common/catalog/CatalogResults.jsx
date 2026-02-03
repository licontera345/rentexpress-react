import VehicleCard from '../cards/VehicleCard';
import Pagination from '../navigation/Pagination';
import EmptyState from '../feedback/EmptyState';
import { MESSAGES, PAGINATION } from '../../../constants';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
