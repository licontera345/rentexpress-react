import { useEffect, useState } from 'react';
import VehicleService from '../../../api/services/VehicleService';
import { MESSAGES, ALERT_TYPES } from '../../../constants';
import './VehicleDetailModal.css';

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
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : vehicle ? (
            <>
              <div className="vehicle-detail-image-placeholder">
                <span className="vehicle-detail-initials">
                  {vehicle.brand?.charAt(0)}{vehicle.model?.charAt(0)}
                </span>
                <p className="no-image-detail-text">Sin imagen</p>
              </div>

              <div className="vehicle-detail-info">
                <h3 className="vehicle-detail-name">
                  {vehicle.brand} {vehicle.model}
                </h3>

                <ul className="vehicle-detail-features">
                  <li><strong>Año de fabricación:</strong> {vehicle.manufactureYear}</li>
                  <li><strong>Matrícula:</strong> {vehicle.licensePlate}</li>
                  <li><strong>VIN:</strong> {vehicle.vinNumber}</li>
                  <li><strong>Kilometraje:</strong> {vehicle.currentMileage?.toLocaleString()} km</li>
                  <li><strong>Precio:</strong> {vehicle.dailyPrice} € / día</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="not-found">Vehículo no encontrado</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close-footer" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailModal;
