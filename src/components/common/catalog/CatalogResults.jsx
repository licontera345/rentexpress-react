import { useEffect, useMemo, useState } from 'react';
import VehicleCard from '../card/VehicleCard';
import Pagination from '../navigation/Pagination';
import EmptyState from '../feedback/EmptyState';
import { MESSAGES, PAGINATION } from '../../../constants';

function CatalogResults({
  vehicles = [],
  onVehicleClick,
  onReserve,
  resultsCount,
  itemsPerPage = PAGINATION.DEFAULT_PAGE_SIZE,
  pagination
}) {
  const isControlled = Boolean(pagination);
  const [internalPage, setInternalPage] = useState(PAGINATION.DEFAULT_PAGE);
  const currentPage = isControlled ? pagination.currentPage : internalPage;

  useEffect(() => {
    if (!isControlled) {
      setInternalPage(PAGINATION.DEFAULT_PAGE);
    }
  }, [isControlled, itemsPerPage, vehicles]);

  if (!vehicles || vehicles.length === 0) {
    return (
      <EmptyState 
        title={MESSAGES.EMPTY_RESULTS}
        description={MESSAGES.NO_VEHICLES_FOUND}
      />
    );
  }

  const totalPages = isControlled ? pagination.totalPages : Math.ceil(vehicles.length / itemsPerPage);
  const paginatedVehicles = useMemo(() => {
    if (isControlled) {
      return vehicles;
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return vehicles.slice(startIdx, endIdx);
  }, [currentPage, isControlled, itemsPerPage, vehicles]);

  const handlePageChange = (newPage) => {
    if (isControlled && pagination.onPageChange) {
      pagination.onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="catalog-results-container">
      <div className="results-header">
        <div className="results-title-group">
          <h2>{MESSAGES.RESULTS_TITLE}</h2>
          <span className="results-count-badge">{resultsCount ?? vehicles.length}</span>
        </div>
      </div>
      
      <div className="vehicle-grid">
        {paginatedVehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle.vehicleId} 
            vehicle={vehicle} 
            onClick={() => onVehicleClick(vehicle.vehicleId)}
            onReserve={onReserve}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxButtons={PAGINATION.MAX_BUTTONS}
        />
      )}
    </div>
  );
}

export default CatalogResults;
