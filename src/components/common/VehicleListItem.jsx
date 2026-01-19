import Button from '../common/Button';
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

  const getStatusBadge = (status) => {
    const statuses = {
      'AVAILABLE': { label: 'Disponible', class: 'status-available' },
      'RENTED': { label: 'Alquilado', class: 'status-rented' },
      'MAINTENANCE': { label: 'Mantenimiento', class: 'status-maintenance' }
    };
    return statuses[status] || { label: 'Desconocido', class: 'status-unknown' };
  };

  const status = getStatusBadge(vehicle.status || 'AVAILABLE');

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
          <span className="detail-value">{formatMileage(vehicle.mileage)}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">Año:</span>
          <span className="detail-value">{vehicle.year}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">VIN:</span>
          <span className="detail-value">{vehicle.vin}</span>
        </div>
      </div>

      <div className="item-actions">
        <Button variant="primary" size="small" onClick={() => onViewDetails(vehicle.vehicleId)}>
          Ver Detalles
        </Button>
        <Button variant="secondary" size="small" onClick={() => onEdit(vehicle.vehicleId)}>
          Editar
        </Button>
        <Button variant="danger" size="small" onClick={() => onDelete(vehicle.vehicleId)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}

export default VehicleListItem;