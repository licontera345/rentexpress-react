import React, { useState } from 'react';
import VehicleService from '../../api/services/VehicleService';
import useApi from '../../hooks/useApi'; 
import VehicleCard from '../../components/common/card/VehicleCard';
import VehicleDetailModal from '../../components/common/modal/VehicleDetailModal';

function Catalog() {
  const { data: vehicles} = useApi(() => VehicleService.search({}), []);

  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const openDetailModal = (vehicleId) => setSelectedVehicleId(vehicleId);
  const closeDetailModal = () => setSelectedVehicleId(null);

  return (
    <section id="catalog-section">
      <h2>Catálogo de Vehículos</h2>
      <p>{vehicles?.results?.length || 0} vehículos disponibles</p>
      
      <ul id="vehicle-list" style={{ listStyleType: 'none', padding: 0 }}>
        {vehicles?.results?.length === 0 ? (
          <li className="catalog-empty">No hay vehículos disponibles</li>
        ) : (
          vehicles?.results?.map(vehicle => (
            <VehicleCard 
              key={vehicle.vehicleId} 
              vehicle={vehicle} 
              onClick={() => openDetailModal(vehicle.vehicleId)} 
            />
          ))
        )}
      </ul>

      <VehicleDetailModal 
        vehicleId={selectedVehicleId} 
        onClose={closeDetailModal} 
      />
    </section>
  );
}

export default Catalog;
