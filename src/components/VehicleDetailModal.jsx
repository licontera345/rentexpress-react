import { useEffect, useState } from 'react';
import { VehicleService } from '../services/api';

const VehicleDetailModal = ({ vehicleId, isOpen, onClose }) => {
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && vehicleId) {
            loadVehicle();
        }
    }, [isOpen, vehicleId]);

    const loadVehicle = async () => {
        setLoading(true);
        try {
            const data = await VehicleService.findById(vehicleId);
            setVehicle(data);
        } catch (error) {
            console.error('Error cargando vehículo:', error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header modal-header-gradient">
                    <h5 className="modal-title-lg">Detalles del Vehículo</h5>
                    <button onClick={onClose} className="btn-close">×</button>
                </div>

                {loading ? (
                    <div className="loading-text">
                        Cargando...
                    </div>
                ) : vehicle ? (
                    <div className="modal-body-grid">
                        <div className="vehicle-detail-image">
                            <span className="vehicle-detail-initials">
                                {vehicle.brand.charAt(0)}{vehicle.model.charAt(0)}
                            </span>
                            <p className="vehicle-card-no-image">Sin imagen</p>
                        </div>

                        <div className="vehicle-detail-content">
                            <div>
                                <h2 className="vehicle-detail-title">
                                    {vehicle.brand} {vehicle.model}
                                </h2>

                                <div className="vehicle-detail-price">
                                    {vehicle.dailyPrice} € / día
                                </div>

                                <ul className="vehicle-detail-list">
                                    <li>
                                        <strong>Año de fabricación:</strong> {vehicle.manufactureYear}
                                    </li>
                                    <li>
                                        <strong>Matrícula:</strong> {vehicle.licensePlate}
                                    </li>
                                    <li>
                                        <strong>VIN:</strong> {vehicle.vinNumber}
                                    </li>
                                    <li>
                                        <strong>Kilometraje:</strong> {vehicle.currentMileage.toLocaleString()} km
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default VehicleDetailModal;