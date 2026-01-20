import { useEffect, useState } from 'react';
import VehicleCard from '../card/VehicleCard';
import Pagination from '../navigation/Pagination';
import EmptyState from '../feedback/EmptyState';
import { MESSAGES } from '../../../constants';
import './CatalogResults.css';

function CatalogResults({ vehicles, onVehicleClick, resultsCount, itemsPerPage = 12 }) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [vehicles, itemsPerPage]);

  if (!vehicles || vehicles.length === 0) {
    return (
      <EmptyState 
        title={MESSAGES.EMPTY_RESULTS}
        description={MESSAGES.NO_VEHICLES_FOUND}
      />
    );
  }

  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedVehicles = vehicles.slice(startIdx, endIdx);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="catalog-results-container">
      <div className="results-header">
        <div className="results-title-group">
          <h2>Resultados</h2>
          <span className="results-count-badge">{resultsCount ?? vehicles.length}</span>
        </div>
      </div>
      
      <div className="vehicle-grid">
        {paginatedVehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle.vehicleId} 
            vehicle={vehicle} 
            onClick={() => onVehicleClick(vehicle.vehicleId)} 
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxButtons={5}
        />
      )}
    </div>
  );
}

export default CatalogResults;
