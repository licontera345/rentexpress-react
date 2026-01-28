import Button from '../actions/Button';
import { MESSAGES, BUTTON_VARIANTS } from '../../../constants';
import { t } from '../../../i18n';

const NUMBER_FORMAT_LOCALE = 'es-ES';
const STATUS_LABELS_BY_ID = {
  1: { label: MESSAGES.AVAILABLE, class: 'status-available' },
  2: { label: MESSAGES.MAINTENANCE, class: 'status-maintenance' },
  3: { label: MESSAGES.RENTED, class: 'status-rented' }
};
const STATUS_CLASSES_BY_NAME = {
  available: 'status-available',
  disponible: 'status-available',
  maintenance: 'status-maintenance',
  mantenimiento: 'status-maintenance',
  rented: 'status-rented',
  alquilado: 'status-rented',
  loue: 'status-rented'
};

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

  const getStatusBadge = () => {
    const statusId = Number(
      vehicle.vehicleStatusId
      ?? vehicle.vehicleStatus?.vehicleStatusId
      ?? vehicle.statusId
      ?? vehicle.status?.vehicleStatusId
    );
    if (STATUS_LABELS_BY_ID[statusId]) {
      return STATUS_LABELS_BY_ID[statusId];
    }

    const statusNameRaw = vehicle.statusName
      ?? vehicle.vehicleStatus?.statusName
      ?? vehicle.status?.statusName
      ?? vehicle.status;
    const statusKey = typeof statusNameRaw === 'string' ? statusNameRaw.trim().toLowerCase() : '';
    if (STATUS_CLASSES_BY_NAME[statusKey]) {
      return { label: statusNameRaw, class: STATUS_CLASSES_BY_NAME[statusKey] };
    }

    const activeStatus = vehicle.activeStatus;
    if (activeStatus !== undefined) {
      return activeStatus
        ? { label: MESSAGES.AVAILABLE, class: 'status-available' }
        : { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };
    }

    return { label: MESSAGES.NOT_AVAILABLE, class: 'status-inactive' };
  };

  const status = getStatusBadge();
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
