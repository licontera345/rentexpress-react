const VehicleCard = ({ vehicle, onClick }) => {
  return (
    <li 
      className="catalog-item" 
      data-vehicle-id={vehicle.vehicleId}
      onClick={() => onClick(vehicle)}
      style={{ cursor: 'pointer' }}
    >
      <div className="vehicle-image-placeholder">
        <span className="vehicle-initials">
          {vehicle.brand.charAt(0)}{vehicle.model.charAt(0)}
        </span>
        <p className="no-image-text">Sin imagen</p>
      </div>
      <div className="vehicle-card">
        <div className="vehicle-header">
          <span className="vehicle-name">{vehicle.brand} {vehicle.model}</span>
          <span className="vehicle-year">{vehicle.manufactureYear}</span>
        </div>
        <div className="vehicle-info">
          <p><strong>Matrícula:</strong> {vehicle.licensePlate}</p>
          <p><strong>Kilometraje:</strong> {vehicle.currentMileage.toLocaleString()} km</p>
        </div>
        <div className="vehicle-price">
          <span className="price-label">Precio por día</span>
          <span className="price-value">{vehicle.dailyPrice}€</span>
        </div>
      </div>
    </li>
  );
};

export default VehicleCard;