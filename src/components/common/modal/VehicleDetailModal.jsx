import { useEffect, useState } from 'react';
import VehicleService from '../../../api/services/VehicleService';
import { MESSAGES, ALERT_TYPES } from '../../../constants';
import { t } from '../../../i18n';

function VehicleDetailModal({ vehicleId, onClose }) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div 
      className={`modal-backdrop ${vehicleId ? 'active' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <h2>{MESSAGES.VEHICLE_DETAILS}</h2>
          <button 
            className="btn-close" 
            onClick={onClose}
            aria-label={MESSAGES.CLOSE}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">{MESSAGES.LOADING}</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : vehicle ? (
            <>
              <div className="vehicle-detail-image-placeholder">
                <span className="vehicle-detail-initials">
                  {vehicle.brand?.charAt(0)}{vehicle.model?.charAt(0)}
                </span>
                <p className="no-image-detail-text">{MESSAGES.NO_IMAGE}</p>
              </div>

              <div className="vehicle-detail-info">
                <h3 className="vehicle-detail-name">
                  {vehicle.brand} {vehicle.model}
                </h3>

                <ul className="vehicle-detail-features">
                  <li>{t('VEHICLE_DETAIL_YEAR', { year: vehicle.manufactureYear })}</li>
                  <li>{t('VEHICLE_DETAIL_PLATE', { plate: vehicle.licensePlate })}</li>
                  <li>{t('VEHICLE_DETAIL_VIN', { vin: vehicle.vinNumber })}</li>
                  <li>{t('VEHICLE_DETAIL_MILEAGE', { mileage: formattedMileage })}</li>
                  <li>{t('VEHICLE_DETAIL_PRICE', { price: formattedPrice })}</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="not-found">{MESSAGES.VEHICLE_NOT_FOUND}</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close-footer" onClick={onClose} type="button">
            {MESSAGES.CLOSE}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailModal;
