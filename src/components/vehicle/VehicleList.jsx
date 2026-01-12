import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles, onVehicleClick, loading }) => {
  if (loading) {
    return (
      <div className="catalog-loading">
        <p>Cargando vehículos...</p>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <li className="catalog-empty">
        <p>No hay vehículos disponibles para los criterios seleccionados</p>
        <p className="catalog-empty-hint">Intenta cambiar las fechas o la ubicación</p>
      </li>
    );
  }

  return (
    <>
      {vehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.vehicleId} 
          vehicle={vehicle} 
          onClick={onVehicleClick}
        />
      ))}
    </>
  );
};

export default VehicleList;