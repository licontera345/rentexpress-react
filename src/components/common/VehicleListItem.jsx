import Button from '../common/Button';
import { MESSAGES, BUTTON_VARIANTS, VEHICLE_STATUS } from '../../constants';
import './VehicleListItem.css';

function VehicleListItem({ vehicle, onEdit, onDelete, onViewDetails }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('es-ES').format(mileage);
  };

  const getStatusBadge = (activeStatus) => {
    if (activeStatus) {
      return { label: MESSAGES.AVAILABLE, class: 'status-available' };
    }
    return { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };
  };

  const isActive = vehicle.activeStatus !== undefined
    ? vehicle.activeStatus
    : vehicle.status === VEHICLE_STATUS.AVAILABLE;
  const status = getStatusBadge(isActive);
  const mileage = vehicle.currentMileage ?? vehicle.mileage ?? 0;
  const year = vehicle.manufactureYear ?? vehicle.year ?? '';
  const vin = vehicle.vinNumber ?? vehicle.vin ?? '';

  return (
    <div className="vehicle-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{vehicle.brand} {vehicle.model}</h3>
          <p className="item-plate">Matrícula: {vehicle.licensePlate}</p>
        </div>
        <div className={`item-status ${status.class}`}>
          {status.label}
        </div>
      </div>

      <div className="item-details">
        <div className="detail-col">
          <span className="detail-label">Precio Diario:</span>
          <span className="detail-value">{formatPrice(vehicle.dailyPrice)}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">Kilómetros:</span>
          <span className="detail-value">{formatMileage(mileage)}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">Año:</span>
          <span className="detail-value">{year}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">VIN:</span>
          <span className="detail-value">{vin}</span>
        </div>
      </div>

      <div className="item-actions">
        {typeof onViewDetails === 'function' && (
          <Button variant={BUTTON_VARIANTS.PRIMARY} size="small" onClick={() => onViewDetails(vehicle.vehicleId)}>
            {MESSAGES.VIEW}
          </Button>
        )}
        {typeof onEdit === 'function' && (
          <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(vehicle.vehicleId)}>
            {MESSAGES.EDIT}
          </Button>
        )}
        {typeof onDelete === 'function' && (
          <Button variant={BUTTON_VARIANTS.DANGER} size="small" onClick={() => onDelete(vehicle.vehicleId)}>
            {MESSAGES.DELETE}
          </Button>
        )}
      </div>
    </div>
  );
}

export default VehicleListItem;
