import Button from '../actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { t } from '../../../i18n';

function VehicleCard({ vehicle, onClick, onReserve }) {
  if (!vehicle) return null;

  const formatPrice = (price) => parseFloat(price).toFixed(2);
  const formatMileage = (mileage) => mileage ? mileage.toLocaleString() : MESSAGES.NOT_AVAILABLE_SHORT;
  const handleReserveClick = (event) => {
    event.stopPropagation();
    onReserve?.(vehicle);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className="vehicle-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="vehicle-image-section">
        <div className="vehicle-image-placeholder">
          <span className="vehicle-initials">
            {vehicle.brand?.charAt(0) || 'V'}
            {vehicle.model?.charAt(0) || 'C'}
          </span>
          <p className="no-image-text">{MESSAGES.NO_IMAGE}</p>
        </div>
        {vehicle.dailyPrice && (
          <div className="vehicle-price-badge">
            {t('PRICE_PER_DAY_BADGE', { price: `€${formatPrice(vehicle.dailyPrice)}` })}
          </div>
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
              <span className="detail-value">
                {t('MILEAGE_WITH_UNIT', { mileage: formatMileage(vehicle.currentMileage) })}
              </span>
            </div>
          )}
        </div>

        <div className="vehicle-card-footer">
          <span className="btn-view-details">{t('VIEW_DETAILS', { action: MESSAGES.VIEW })}</span>
          <Button
            type="button"
            variant={BUTTON_VARIANTS.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            className="vehicle-reserve-button"
            onClick={handleReserveClick}
          >
            {MESSAGES.RESERVE}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VehicleCard;
