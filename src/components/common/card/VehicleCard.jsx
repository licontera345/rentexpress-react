import { MESSAGES } from '../../../constants';

function VehicleCard({ vehicle, onClick }) {
  if (!vehicle) return null;

  const formatPrice = (price) => parseFloat(price).toFixed(2);
  const formatMileage = (mileage) => mileage ? mileage.toLocaleString() : 'N/A';

  return (
    <button className="vehicle-card" onClick={onClick} type="button">
      <div className="vehicle-image-section">
        <div className="vehicle-image-placeholder">
          <span className="vehicle-initials">
            {vehicle.brand?.charAt(0) || 'V'}
            {vehicle.model?.charAt(0) || 'C'}
          </span>
          <p className="no-image-text">Sin imagen</p>
        </div>
        {vehicle.dailyPrice && (
          <div className="vehicle-price-badge">${formatPrice(vehicle.dailyPrice)}/día</div>
        )}
      </div>

      <div className="vehicle-card-content">
        <div className="vehicle-card-header">
          <div className="vehicle-name-section">
            <h3 className="vehicle-name">
              {vehicle.brand} <span className="vehicle-model">{vehicle.model}</span>
            </h3>
            {vehicle.manufactureYear && (
              <span className="vehicle-year">{vehicle.manufactureYear}</span>
            )}
          </div>
        </div>

        <div className="vehicle-card-details">
          {vehicle.licensePlate && (
            <div className="detail-item">
              <span className="detail-value">{vehicle.licensePlate}</span>
            </div>
          )}
          {vehicle.currentMileage !== undefined && (
            <div className="detail-item">
              <span className="detail-value">{formatMileage(vehicle.currentMileage)} km</span>
            </div>
          )}
        </div>

        <div className="vehicle-card-footer">
          <span className="btn-view-details">{MESSAGES.VIEW} detalles →</span>
        </div>
      </div>
    </button>
  );
}

export default VehicleCard;
