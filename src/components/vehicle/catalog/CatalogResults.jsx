import VehicleCard from '../cards/VehicleCard';
import Pagination from '../../common/navigation/Pagination';
import EmptyState from '../../common/feedback/EmptyState';
import { MESSAGES, PAGINATION } from '../../../constants';

// Componente CatalogResults que define la interfaz y organiza la lógica de esta vista.

function CatalogResults({
  vehicles = [],
  onVehicleClick,
  onReserve,
  onAdvisorClick,
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
        <div className="results-actions">
          <button
            type="button"
            className="results-ai-button"
            onClick={onAdvisorClick}
            disabled={!onAdvisorClick || vehicles.length === 0}
          >
            <span className="results-ai-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 2.5c3.87 0 7 3.13 7 7v1.2c0 .64.26 1.26.72 1.71l.58.59c.47.47.47 1.23 0 1.7l-.58.59a2.4 2.4 0 0 0-.72 1.71V18a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 5 18v-.7c0-.64-.25-1.26-.72-1.71l-.58-.59a1.2 1.2 0 0 1 0-1.7l.58-.59A2.4 2.4 0 0 0 5 10.7V9.5c0-3.87 3.13-7 7-7Zm0 2.5a4.5 4.5 0 0 0-4.5 4.5v1.2c0 1.3-.52 2.54-1.44 3.46l-.04.04.04.04c.92.92 1.44 2.16 1.44 3.46V18c0 .55.45 1 1 1h7a1 1 0 0 0 1-1v-.76c0-1.3.52-2.54 1.44-3.46l.04-.04-.04-.04A4.9 4.9 0 0 1 16.5 10.7V9.5A4.5 4.5 0 0 0 12 5Zm0 3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm0 4a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Asistente IA
          </button>
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
