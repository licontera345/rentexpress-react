import Button from '../../common/actions/Button';
import { MESSAGES, BUTTON_VARIANTS } from '../../../constants';
import { t } from '../../../i18n';
import { formatCurrency, formatNumber } from '../../../config/formatters';
import { STATUS_NAMES } from '../../../constants/VehicleListItem.constants';

const DEFAULT_STATUS = { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };

const getStatusName = (vehicle) => {
  const status = Array.isArray(vehicle?.vehicleStatus)
    ? vehicle.vehicleStatus[0]
    : vehicle?.vehicleStatus;
  const name = vehicle?.statusName ?? status?.statusName;

  return typeof name === 'string' ? name.trim().toLowerCase() : '';
};

const resolveStatus = (vehicle) => {
  const statusName = getStatusName(vehicle);
  if (statusName && STATUS_NAMES[statusName]) {
    const label = vehicle?.statusName ?? statusName;
    return {
      label: typeof label === 'string' ? label : MESSAGES.NOT_AVAILABLE,
      class: STATUS_NAMES[statusName]
    };
  }

  return DEFAULT_STATUS;
};

export const formatVehicleData = (vehicle = {}) => {
  const brand = vehicle.brand ?? '';
  const model = vehicle.model ?? '';
  const title = [brand, model].filter(Boolean).join(' ').trim() || MESSAGES.NOT_AVAILABLE_SHORT;

  return {
    status: resolveStatus(vehicle),
    vehicleId: vehicle.vehicleId ?? vehicle.id ?? null,
    mileage: vehicle.currentMileage ?? vehicle.mileage ?? null,
    year: vehicle.manufactureYear ?? vehicle.year ?? MESSAGES.NOT_AVAILABLE_SHORT,
    vin: vehicle.vinNumber ?? vehicle.vin ?? MESSAGES.NOT_AVAILABLE_SHORT,
    licensePlate: vehicle.licensePlate ?? MESSAGES.NOT_AVAILABLE_SHORT,
    title
  };
};

// Item del listado de vehículos con detalles y acciones rápidas.
// Props esperadas: vehicle (datos del vehículo) y callbacks opcionales onEdit/onDelete/onViewDetails.
function VehicleListItem({ vehicle, onEdit, onDelete, onViewDetails }) {
  const {
    status,
    vehicleId,
    mileage,
    year,
    vin,
    licensePlate,
    title
  } = formatVehicleData(vehicle);

  return (
    <div className="vehicle-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{title}</h3>
          <p className="item-plate">
            {t('VEHICLE_LIST_PLATE', { plate: licensePlate })}
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
