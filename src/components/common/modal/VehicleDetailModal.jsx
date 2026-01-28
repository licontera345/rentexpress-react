import { useEffect, useRef, useState } from 'react';
import VehicleService from '../../../api/services/VehicleService';
import Button from '../actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { t } from '../../../i18n';

const STATUS_LABELS_BY_ID = {
  1: MESSAGES.AVAILABLE,
  2: MESSAGES.MAINTENANCE,
  3: MESSAGES.RENTED
};

const resolveStatusLabel = (vehicle) => {
  const statusId = Number(
    vehicle?.vehicleStatusId
    ?? vehicle?.vehicleStatus?.vehicleStatusId
    ?? vehicle?.statusId
    ?? vehicle?.status?.vehicleStatusId
  );
  if (STATUS_LABELS_BY_ID[statusId]) {
    return STATUS_LABELS_BY_ID[statusId];
  }

  return (
    vehicle?.statusName
    ?? vehicle?.vehicleStatus?.statusName
    ?? vehicle?.status?.statusName
    ?? vehicle?.status
    ?? MESSAGES.NOT_AVAILABLE_SHORT
  );
};

const resolveCategoryLabel = (vehicle) => (
  vehicle?.category?.categoryName
  ?? vehicle?.category?.name
  ?? vehicle?.vehicleCategory?.categoryName
  ?? vehicle?.vehicleCategory?.name
  ?? vehicle?.categoryName
  ?? vehicle?.category
  ?? MESSAGES.NOT_AVAILABLE_SHORT
);

const resolveHeadquartersLabel = (vehicle) => (
  vehicle?.currentHeadquarters?.headquartersName
  ?? vehicle?.currentHeadquarters?.name
  ?? vehicle?.currentHeadquartersName
  ?? vehicle?.headquartersName
  ?? vehicle?.headquarters?.headquartersName
  ?? vehicle?.headquarters?.name
  ?? MESSAGES.NOT_AVAILABLE_SHORT
);

function VehicleDetailModal({
  vehicleId,
  onClose,
  onReserve,
  showReserveButton = true
}) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dialogRef = useRef(null);
  const lastFocusedElement = useRef(null);

  useEffect(() => {
    if (!vehicleId) {
      setVehicle(null);
      return;
    }

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await VehicleService.findById(vehicleId);
        setVehicle(data);
      } catch (err) {
        setError(err.message || MESSAGES.FETCH_VEHICLE_ERROR);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  useEffect(() => {
    if (!vehicleId) {
      return undefined;
    }

    lastFocusedElement.current = document.activeElement;
    const dialogNode = dialogRef.current;
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const focusableElements = dialogNode?.querySelectorAll(focusableSelector);
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    } else if (dialogNode) {
      dialogNode.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !focusableElements?.length) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    };

    dialogNode?.addEventListener('keydown', handleKeyDown);

    return () => {
      dialogNode?.removeEventListener('keydown', handleKeyDown);
      if (lastFocusedElement.current instanceof HTMLElement) {
        lastFocusedElement.current.focus();
      }
    };
  }, [vehicleId, onClose]);

  if (!vehicleId) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formattedMileage = vehicle?.currentMileage !== undefined
    ? vehicle.currentMileage.toLocaleString()
    : MESSAGES.NOT_AVAILABLE_SHORT;

  const formattedPrice = vehicle?.dailyPrice ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const mileageDisplay = formattedMileage !== MESSAGES.NOT_AVAILABLE_SHORT
    ? `${formattedMileage} km`
    : formattedMileage;
  const priceDisplay = formattedPrice !== MESSAGES.NOT_AVAILABLE_SHORT
    ? `${formattedPrice} €`
    : formattedPrice;
  const statusLabel = resolveStatusLabel(vehicle);
  const categoryLabel = resolveCategoryLabel(vehicle);
  const headquartersLabel = resolveHeadquartersLabel(vehicle);

  return (
    <div
      className={`modal-backdrop ${vehicleId ? 'active' : ''}`}
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
          {loading ? (
            <div className="loading">{MESSAGES.LOADING}</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : vehicle ? (
            <>
              <div className="vehicle-detail-content">
                <div className="vehicle-detail-image-placeholder">
                  <span className="vehicle-detail-image-tag">{MESSAGES.NO_IMAGE}</span>
                  <span className="vehicle-detail-initials">
                    {vehicle.brand?.charAt(0)}{vehicle.model?.charAt(0)}
                  </span>
                  <p className="no-image-detail-text">{t('VEHICLE_DETAIL_IMAGE_HINT')}</p>
                </div>

                <div className="vehicle-detail-info">
                  <div className="vehicle-detail-header">
                    <div>
                      <h3 className="vehicle-detail-name">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="vehicle-detail-subtitle">
                        {t('VEHICLE_DETAIL_SUBTITLE')}
                      </p>
                    </div>
                    <div className="vehicle-detail-price">
                      <span className="vehicle-detail-price-value">{priceDisplay}</span>
                      <span className="vehicle-detail-price-label">
                        {t('VEHICLE_DETAIL_PRICE_UNIT')}
                      </span>
                    </div>
                  </div>

                  <div className="vehicle-detail-badges">
                    <span className="vehicle-detail-badge">
                      {t('VEHICLE_DETAIL_BADGE_YEAR', { year: vehicle.manufactureYear })}
                    </span>
                    <span className="vehicle-detail-badge">
                      {t('VEHICLE_DETAIL_BADGE_MILEAGE', { mileage: formattedMileage })}
                    </span>
                    <span className="vehicle-detail-badge">
                      {statusLabel}
                    </span>
                  </div>

                  <dl className="vehicle-detail-specs">
                    <div className="vehicle-detail-spec">
                      <dt>{t('VEHICLE_DETAIL_LABEL_PLATE')}</dt>
                      <dd>{vehicle.licensePlate ?? MESSAGES.NOT_AVAILABLE_SHORT}</dd>
                    </div>
                    <div className="vehicle-detail-spec">
                      <dt>{MESSAGES.CATEGORY}</dt>
                      <dd>{categoryLabel}</dd>
                    </div>
                    <div className="vehicle-detail-spec full-width">
                      <dt>{t('VEHICLE_DETAIL_LABEL_VIN')}</dt>
                      <dd>{vehicle.vinNumber ?? MESSAGES.NOT_AVAILABLE_SHORT}</dd>
                    </div>
                    <div className="vehicle-detail-spec">
                      <dt>{MESSAGES.HEADQUARTERS_LABEL}</dt>
                      <dd>{headquartersLabel}</dd>
                    </div>
                    <div className="vehicle-detail-spec">
                      <dt>{MESSAGES.STATUS}</dt>
                      <dd>{statusLabel}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </>
          ) : (
            <div className="not-found">{MESSAGES.VEHICLE_NOT_FOUND}</div>
          )}
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
