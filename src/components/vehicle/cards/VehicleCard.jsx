import Button from '../../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { t } from '../../../i18n';
import { formatCurrency, formatNumber } from '../../../config/formatters';

// Componente VehicleCard que define la interfaz y organiza la lógica de esta vista.

function VehicleCard({ vehicle, onClick, onReserve }) {
  if (!vehicle) return null;

  const price = formatCurrency(vehicle.dailyPrice);
  const mileage = formatNumber(vehicle.currentMileage, {
    fallback: MESSAGES.NOT_AVAILABLE_SHORT
  });

  const getVehicleInitials = () => {
    const brandInitial = vehicle.brand?.[0] || 'V';
    const modelInitial = vehicle.model?.[0] || 'C';
    return `${brandInitial}${modelInitial}`;
  };

  const handleReserve = (e) => {
    e.stopPropagation();
    if (onReserve) onReserve(vehicle);
  };

  const handleKeyPress = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="vehicle-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyPress}
    >
      <div className="vehicle-image-section">
        <div className="vehicle-image-placeholder">
          <span className="vehicle-initials">{getVehicleInitials()}</span>
          <p className="no-image-text">{MESSAGES.NO_IMAGE}</p>
        </div>
        
        {price && (
          <div className="vehicle-price-badge">
            {t('PRICE_PER_DAY_BADGE', { price })}
          </div>
        )}
      </div>

      <div className="vehicle-card-content">
        <div className="vehicle-card-header">
          <h3 className="vehicle-name">
            {vehicle.brand} <span className="vehicle-model">{vehicle.model}</span>
          </h3>
          {vehicle.manufactureYear && (
            <span className="vehicle-year">{vehicle.manufactureYear}</span>
          )}
        </div>

        <div className="vehicle-card-details">
          {vehicle.licensePlate && (
            <div className="detail-item">
              <span className="detail-value">{vehicle.licensePlate}</span>
            </div>
          )}
          
          {vehicle.currentMileage !== undefined && (
            <div className="detail-item">
              <span className="detail-value">
                {t('MILEAGE_WITH_UNIT', { mileage })}
              </span>
            </div>
          )}
        </div>

        <div className="vehicle-card-footer">
          <span className="btn-view-details">
            {t('VIEW_DETAILS', { action: MESSAGES.VIEW })}
          </span>
          
          <Button
            type="button"
            variant={BUTTON_VARIANTS.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            className="vehicle-reserve-button"
            onClick={handleReserve}
          >
            {MESSAGES.RESERVE}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VehicleCard;
