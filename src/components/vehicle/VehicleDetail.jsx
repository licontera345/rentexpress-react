import Modal from '../common/Modal';

const VehicleDetail = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  return (
    <Modal isOpen={!!vehicle} onClose={onClose} title="Detalles del Vehículo">
      <div className="vehicle-detail-container">
        <div className="vehicle-detail-image-placeholder">
          <span className="vehicle-detail-initials">
            {vehicle.brand.charAt(0)}{vehicle.model.charAt(0)}
          </span>
          <p className="no-image-detail-text">Sin imagen</p>
        </div>
        
        <div className="vehicle-detail-info">
          <h2 className="vehicle-detail-name">
            {vehicle.brand} {vehicle.model}
          </h2>
          
          <p className="vehicle-detail-price">
            {vehicle.dailyPrice}€ <span className="price-period">/ día</span>
          </p>
          
          <div className="vehicle-detail-section">
            <h3>Características principales</h3>
            <ul className="vehicle-detail-features">
              <li>
                <strong>Año de fabricación:</strong> {vehicle.manufactureYear}
              </li>
              <li>
                <strong>Matrícula:</strong> {vehicle.licensePlate}
              </li>
              <li>
                <strong>VIN:</strong> {vehicle.vinNumber}
              </li>
              <li>
                <strong>Kilometraje:</strong> {vehicle.currentMileage.toLocaleString('es-ES')} km
              </li>
              <li>
                <strong>Estado:</strong>{' '}
                <span className={`status-badge ${vehicle.activeStatus ? 'status-active' : 'status-inactive'}`}>
                  {vehicle.activeStatus ? 'Disponible' : 'No disponible'}
                </span>
              </li>
            </ul>
          </div>

          {(vehicle.color || vehicle.fuelType || vehicle.transmission) && (
            <div className="vehicle-detail-section">
              <h3>Información adicional</h3>
              <ul className="vehicle-detail-features">
                {vehicle.color && (
                  <li><strong>Color:</strong> {vehicle.color}</li>
                )}
                {vehicle.fuelType && (
                  <li><strong>Combustible:</strong> {vehicle.fuelType}</li>
                )}
                {vehicle.transmission && (
                  <li><strong>Transmisión:</strong> {vehicle.transmission}</li>
                )}
              </ul>
            </div>
          )}

          <div className="vehicle-detail-actions">
            <button className="btn btn-primary btn-block">
              Reservar ahora
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VehicleDetail;