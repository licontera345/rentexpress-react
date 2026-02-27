import Button from '../../common/actions/Button';
import { MESSAGES, BUTTON_VARIANTS } from '../../../constants';
import { t } from '../../../i18n';
import { formatCurrency, formatNumber } from '../../../utils/form/formatters';
import { formatVehicleListItemData } from '../../../utils/vehicle';
import useVehicleImage from '../../../hooks/vehicle/useVehicleImage';
import VehicleImage from '../common/VehicleImage';

// Item del listado de vehículos con detalles y acciones rápidas.
// La página pasa statusMap; el hook de imagen se usa aquí para mantener el componente sin lógica de datos en hijos.
function VehicleListItem({ vehicle, onEdit, onDelete, onViewDetails, statusMap }) {
  const {
    status,
    vehicleId,
    mileage,
    year,
    vin,
    licensePlate,
    title
  } = formatVehicleListItemData(vehicle, statusMap);
  const { imageSrc, hasImage } = useVehicleImage(vehicleId);

  return (
    <div className="vehicle-list-item">
      <div className="item-header">
        <div className="vehicle-list-thumb">
          <VehicleImage
            imageSrc={imageSrc}
            hasImage={hasImage}
            alt={title}
            className="vehicle-list-thumb-image"
            fallbackClassName="vehicle-list-thumb-placeholder"
            showNoImageLabel={false}
            initials={title.slice(0, 2).toUpperCase()}
          />
        </div>
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
