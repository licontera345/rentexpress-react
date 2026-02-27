import Button from '../../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { t } from '../../../i18n';
import { formatCurrency, formatNumber } from '../../../utils/form/formatters';
import { getVehicleInitials } from '../../../utils/vehicle';
import useVehicleImage from '../../../hooks/vehicle/useVehicleImage';
import VehicleImage from '../common/VehicleImage';

function VehicleCard({ vehicle, onClick, onReserve, variant }) {
  if (!vehicle) return null;

  const { imageSrc, hasImage } = useVehicleImage(vehicle.vehicleId);
  const price = formatCurrency(vehicle.dailyPrice);
  const mileage = formatNumber(vehicle.currentMileage, {
    fallback: MESSAGES.NOT_AVAILABLE_SHORT
  });
  const isCatalog = variant === 'catalog';

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

  if (isCatalog) {
    return (
      <div
        className="catalog-vehicle-card"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyPress}
      >
        <div className="catalog-card-img-wrap">
          {hasImage ? (
            <img src={imageSrc} alt={`${vehicle.brand} ${vehicle.model}`} />
          ) : (
            <div className="catalog-card-placeholder">
              <div className="catalog-card-initials">{getVehicleInitials(vehicle)}</div>
              <span className="catalog-card-no-img">{t('NO_IMAGE')}</span>
            </div>
          )}
          {price && <span className="catalog-card-price">{t('PRICE_PER_DAY_BADGE', { price })}</span>}
          <span className="catalog-card-dot" aria-hidden />
        </div>
        <div className="catalog-card-body">
          <div className="catalog-card-name-row">
            <div className="catalog-card-name">
              {vehicle.brand} <span className="catalog-card-model">{vehicle.model}</span>
            </div>
            {vehicle.manufactureYear && <span className="catalog-card-year">{vehicle.manufactureYear}</span>}
          </div>
          <div className="catalog-card-specs">
            {vehicle.licensePlate && (
              <div className="catalog-card-spec">
                <span className="catalog-card-spec-label">{t('LICENSE_PLATE')}</span>
                <span className="catalog-card-spec-value">{vehicle.licensePlate}</span>
              </div>
            )}
            <div className="catalog-card-spec">
              <span className="catalog-card-spec-label">Km</span>
              <span className="catalog-card-spec-value">{mileage}</span>
            </div>
          </div>
        </div>
        <div className="catalog-card-footer">
          <button type="button" className="catalog-btn-details">
            {t('VIEW_DETAILS', { action: MESSAGES.VIEW })} →
          </button>
          <button type="button" className="catalog-btn-reserve" onClick={handleReserve}>
            {MESSAGES.RESERVE}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`vehicle-card${vehicle.isRecommended ? ' vehicle-card--recommended' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyPress}
    >
      <div className="vehicle-image-section">
        {vehicle.isRecommended && (
          <span className="vehicle-recommended-badge">{t('REC_BADGE')}</span>
        )}
        <VehicleImage
          imageSrc={imageSrc}
          hasImage={hasImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="vehicle-image"
          fallbackClassName="vehicle-image-placeholder"
          initials={getVehicleInitials(vehicle)}
        />

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
