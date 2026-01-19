import React, { useState, useCallback } from 'react';
import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import VehicleDetailModal from '../../components/common/modal/VehicleDetailModal';
import CatalogResults from '../../components/common/CatalogResults';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useVehicleSearch from '../../hooks/useVehicleSearch';
import './Catalog.css';

function Catalog() {
  const { vehicles, loading, error, searchVehicles } = useVehicleSearch();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const handleSearch = useCallback((criteria) => {
    searchVehicles(criteria).catch(() => {});
  }, [searchVehicles]);

  return (
    <PublicLayout>
      <section className="catalog-section">
        <div className="catalog-container">
          <div className="catalog-search-wrapper">
            <SearchPanel onSearch={handleSearch} />
          </div>

          {loading && <LoadingSpinner message="Cargando..." />}

          {!loading && !error && (
            <CatalogResults 
              vehicles={vehicles} 
              onVehicleClick={setSelectedVehicleId}
            />
          )}
        </div>

        <VehicleDetailModal 
          vehicleId={selectedVehicleId} 
          onClose={() => setSelectedVehicleId(null)} 
        />
      </section>
    </PublicLayout>
  );
}

export default Catalog;

