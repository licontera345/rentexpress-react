import Button from '../actions/Button';
import { MESSAGES, BUTTON_VARIANTS, VEHICLE_STATUS } from '../../../constants';
import { t } from '../../../i18n';

const NUMBER_FORMAT_LOCALE = 'es-ES';

function VehicleListItem({ vehicle, onEdit, onDelete, onViewDetails }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE, {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE).format(mileage);
  };

  const getStatusBadge = (activeStatus) => {
    if (activeStatus) {
      return { label: MESSAGES.AVAILABLE, class: 'status-available' };
    }
    return { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };
  };

  const vehicleId = vehicle.vehicleId ?? vehicle.id;
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
          <p className="item-plate">{t('VEHICLE_LIST_PLATE', { plate: vehicle.licensePlate })}</p>
        </div>
        <div className={`item-status ${status.class}`}>
          {status.label}
        </div>
      </div>

      <div className="item-details">
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.DAILY_PRICE}</span>
          <span className="detail-value">{formatPrice(vehicle.dailyPrice)}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.MILEAGE}</span>
          <span className="detail-value">{formatMileage(mileage)}</span>
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
        {typeof onViewDetails === 'function' && (
          <Button variant={BUTTON_VARIANTS.PRIMARY} size="small" onClick={() => onViewDetails(vehicleId)}>
            {MESSAGES.VIEW}
          </Button>
        )}
        {typeof onEdit === 'function' && (
          <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(vehicleId)}>
            {MESSAGES.EDIT}
          </Button>
        )}
        {typeof onDelete === 'function' && (
          <Button variant={BUTTON_VARIANTS.DANGER} size="small" onClick={() => onDelete(vehicleId)}>
            {MESSAGES.DELETE}
          </Button>
        )}
      </div>
    </div>
  );
}

export default VehicleListItem;
