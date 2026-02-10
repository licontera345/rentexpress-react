import { useRef } from 'react';
import Button from '../../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { t } from '../../../i18n';
import useHeadquarters from '../../../hooks/useHeadquarters';
import useVehicleCategories from '../../../hooks/useVehicleCategories';
import useVehicleDetail from '../../../hooks/useVehicleDetail';
import { formatCurrency } from '../../../config/formatters';
import useModalFocus from '../../../hooks/useModalFocus';
import useVehicleImage from '../../../hooks/useVehicleImage';
import {
  resolveCategoryLabel,
  resolveHeadquartersLabel,
  resolveStatusLabel
} from '../../../config/vehicleDetailLabels';

// Modal de detalle que muestra información completa y acciones de reserva.
function VehicleDetailModal({
  vehicleId,
  onClose,
  onReserve,
  showReserveButton = true
}) {
  const { vehicle, loading, error } = useVehicleDetail(vehicleId);
  const { categoryMap } = useVehicleCategories();
  const dialogRef = useRef(null);
  const { headquartersMap } = useHeadquarters();
  const { imageSrc, hasImage } = useVehicleImage(vehicleId);

  useModalFocus({
    isOpen: Boolean(vehicleId),
    onClose,
    dialogRef
  });

  if (!vehicleId) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formattedVehicle = vehicle ? (() => {
    const formattedMileage = vehicle.currentMileage !== undefined
      ? vehicle.currentMileage.toLocaleString()
      : MESSAGES.NOT_AVAILABLE_SHORT;

    const priceDisplay = formatCurrency(vehicle.dailyPrice, {
      fallback: MESSAGES.NOT_AVAILABLE_SHORT
    });

    return {
      brand: vehicle.brand,
      model: vehicle.model,
      initials: `${vehicle.brand?.charAt(0) ?? ''}${vehicle.model?.charAt(0) ?? ''}`,
      manufactureYear: vehicle.manufactureYear,
      licensePlate: vehicle.licensePlate ?? MESSAGES.NOT_AVAILABLE_SHORT,
      vinNumber: vehicle.vinNumber ?? MESSAGES.NOT_AVAILABLE_SHORT,
      priceDisplay,
      formattedMileage,
      statusLabel: resolveStatusLabel(vehicle),
      categoryLabel: resolveCategoryLabel(vehicle, categoryMap),
      headquartersLabel: resolveHeadquartersLabel(vehicle, headquartersMap)
    };
  })() : null;

  let bodyContent;
  if (loading) {
    bodyContent = <div className="loading">{MESSAGES.LOADING}</div>;
  } else if (error) {
    bodyContent = <div className="error">{error}</div>;
  } else if (!formattedVehicle) {
    bodyContent = <div className="not-found">{MESSAGES.VEHICLE_NOT_FOUND}</div>;
  } else {
    bodyContent = (
      <div className="vehicle-detail-content">
        <div className="vehicle-detail-image-placeholder">
          <img
            className="vehicle-detail-image"
            src={imageSrc}
            alt={`${formattedVehicle.brand} ${formattedVehicle.model}`}
          />
          {!hasImage && (
            <>
              <span className="vehicle-detail-image-tag">{MESSAGES.NO_IMAGE}</span>
              <span className="vehicle-detail-initials">
                {formattedVehicle.initials}
              </span>
              <p className="no-image-detail-text">{t('VEHICLE_DETAIL_IMAGE_HINT')}</p>
            </>
          )}
        </div>

        <div className="vehicle-detail-info">
          <div className="vehicle-detail-header">
            <div>
              <h3 className="vehicle-detail-name">
                {formattedVehicle.brand} {formattedVehicle.model}
              </h3>
              <p className="vehicle-detail-subtitle">
                {t('VEHICLE_DETAIL_SUBTITLE')}
              </p>
            </div>
            <div className="vehicle-detail-price">
              <span className="vehicle-detail-price-value">
                {formattedVehicle.priceDisplay}
              </span>
              <span className="vehicle-detail-price-label">
                {t('VEHICLE_DETAIL_PRICE_UNIT')}
              </span>
            </div>
          </div>

          <div className="vehicle-detail-badges">
            <span className="vehicle-detail-badge">
              {t('VEHICLE_DETAIL_BADGE_YEAR', { year: formattedVehicle.manufactureYear })}
            </span>
            <span className="vehicle-detail-badge">
              {t('VEHICLE_DETAIL_BADGE_MILEAGE', {
                mileage: formattedVehicle.formattedMileage
              })}
            </span>
            <span className="vehicle-detail-badge">
              {formattedVehicle.statusLabel}
            </span>
          </div>

          <dl className="vehicle-detail-specs">
            <div className="vehicle-detail-spec">
              <dt>{t('VEHICLE_DETAIL_LABEL_PLATE')}</dt>
              <dd>{formattedVehicle.licensePlate}</dd>
            </div>
            <div className="vehicle-detail-spec">
              <dt>{MESSAGES.CATEGORY}</dt>
              <dd>{formattedVehicle.categoryLabel}</dd>
            </div>
            <div className="vehicle-detail-spec full-width">
              <dt>{t('VEHICLE_DETAIL_LABEL_VIN')}</dt>
              <dd>{formattedVehicle.vinNumber}</dd>
            </div>
            <div className="vehicle-detail-spec">
              <dt>{MESSAGES.HEADQUARTERS_LABEL}</dt>
              <dd>{formattedVehicle.headquartersLabel}</dd>
            </div>
            <div className="vehicle-detail-spec">
              <dt>{MESSAGES.STATUS}</dt>
              <dd>{formattedVehicle.statusLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`modal-backdrop modal-backdrop--detail ${vehicleId ? 'active' : ''}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="modal-dialog vehicle-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-detail-title"
        aria-describedby="vehicle-detail-body"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="modal-header">
          <h2 id="vehicle-detail-title">{MESSAGES.VEHICLE_DETAILS}</h2>
          <button 
            className="btn-close" 
            onClick={onClose}
            aria-label={MESSAGES.CLOSE}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body" id="vehicle-detail-body">
          {bodyContent}
        </div>

        <div className="modal-footer vehicle-detail-footer">
          {showReserveButton && (
            <p className="vehicle-detail-note">
              {t('VEHICLE_DETAIL_RESERVATION_NOTE')}
            </p>
          )}
          <div className="vehicle-detail-actions">
            <button className="btn-close-footer" onClick={onClose} type="button">
              {MESSAGES.CLOSE}
            </button>
            {showReserveButton && (
              <Button
                type="button"
                variant={BUTTON_VARIANTS.PRIMARY}
                size={BUTTON_SIZES.SMALL}
                disabled={!vehicle || loading || Boolean(error)}
                onClick={() => onReserve?.(vehicle)}
              >
                {MESSAGES.RESERVE}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailModal;
