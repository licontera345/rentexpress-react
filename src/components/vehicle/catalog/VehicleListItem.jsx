import Button from '../../common/actions/Button';
import { MESSAGES, BUTTON_VARIANTS } from '../../../constants';
import { t } from '../../../i18n';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

const STATUS_CONFIG = {
  1: { label: MESSAGES.AVAILABLE, class: 'status-available' },
  2: { label: MESSAGES.MAINTENANCE, class: 'status-maintenance' },
  3: { label: MESSAGES.RENTED, class: 'status-rented' }
};

const STATUS_NAMES = {
  available: 'status-available',
  disponible: 'status-available',
  maintenance: 'status-maintenance',
  mantenimiento: 'status-maintenance',
  rented: 'status-rented',
  alquilado: 'status-rented',
  loue: 'status-rented'
};

function VehicleListItem({ vehicle, onEdit, onDelete, onViewDetails }) {
  const getStatusId = () => {
    return Number(
      vehicle.vehicleStatusId ||
      vehicle.vehicleStatus?.vehicleStatusId ||
      vehicle.statusId ||
      vehicle.status?.vehicleStatusId
    );
  };

  const getStatusName = () => {
    const name = vehicle.statusName ||
      vehicle.vehicleStatus?.statusName ||
      vehicle.status?.statusName ||
      vehicle.status;
    
    return typeof name === 'string' ? name.trim().toLowerCase() : '';
  };

  const getStatus = () => {
    const statusId = getStatusId();
    if (STATUS_CONFIG[statusId]) {
      return STATUS_CONFIG[statusId];
    }

    const statusName = getStatusName();
    if (STATUS_NAMES[statusName]) {
      return { 
        label: vehicle.statusName || vehicle.status, 
        class: STATUS_NAMES[statusName] 
      };
    }

    if (vehicle.activeStatus !== undefined) {
      return vehicle.activeStatus
        ? { label: MESSAGES.AVAILABLE, class: 'status-available' }
        : { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };
    }

    return { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };
  };

  const status = getStatus();
  const vehicleId = vehicle.vehicleId || vehicle.id;
  const mileage = vehicle.currentMileage || vehicle.mileage || 0;
  const year = vehicle.manufactureYear || vehicle.year || '';
  const vin = vehicle.vinNumber || vehicle.vin || '';

  return (
    <div className="vehicle-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{vehicle.brand} {vehicle.model}</h3>
          <p className="item-plate">
            {t('VEHICLE_LIST_PLATE', { plate: vehicle.licensePlate })}
          </p>
        </div>
        <div className={`item-status ${status.class}`}>
          {status.label}
        </div>
      </div>

      <div className="item-details">
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.DAILY_PRICE}</span>
          <span className="detail-value">
            {formatCurrency(vehicle.dailyPrice, { 
              fallback: MESSAGES.NOT_AVAILABLE_SHORT 
            })}
          </span>
        </div>
        
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.MILEAGE}</span>
          <span className="detail-value">
            {formatNumber(mileage, { 
              fallback: MESSAGES.NOT_AVAILABLE_SHORT 
            })}
          </span>
        </div>
        
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.YEAR}</span>
          <span className="detail-value">{year}</span>
        </div>
        
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.VIN}</span>
          <span className="detail-value">{vin}</span>
        </div>
      </div>

      <div className="item-actions">
        <div className="item-actions-group">
          {onViewDetails && (
            <Button 
              variant={BUTTON_VARIANTS.PRIMARY} 
              size="small" 
              onClick={() => onViewDetails(vehicleId)}
            >
              {MESSAGES.VIEW}
            </Button>
          )}
          
          {onEdit && (
            <Button 
              variant={BUTTON_VARIANTS.SECONDARY} 
              size="small" 
              onClick={() => onEdit(vehicleId)}
            >
              {MESSAGES.EDIT}
            </Button>
          )}
        </div>
        
        {onDelete && (
          <Button
            className="item-actions-delete"
            variant={BUTTON_VARIANTS.DANGER}
            size="small"
            onClick={() => onDelete(vehicleId)}
          >
            {MESSAGES.DELETE}
          </Button>
        )}
      </div>
    </div>
  );
}

export default VehicleListItem;
