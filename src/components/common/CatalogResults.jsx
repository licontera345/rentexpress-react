import { useState } from 'react';
import VehicleCard from './card/VehicleCard';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import './CatalogResults.css';

function CatalogResults({ vehicles, onVehicleClick, resultsCount, itemsPerPage = 12 }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!vehicles || vehicles.length === 0) {
    return (
      <EmptyState 
        title="No hay vehículos disponibles"
        description="Intenta ajustar tus criterios de búsqueda"
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
          <span className="results-count-badge">{resultsCount || vehicles.length}</span>
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
