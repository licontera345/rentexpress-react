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
        <div 
            style={{ 
                display: 'flex', 
                position: 'fixed', 
                inset: 0, 
                zIndex: 1000, 
                background: 'rgba(0, 0, 0, 0.6)', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '20px',
                overflowY: 'auto'
            }}
            onClick={onClose}
        >
            <div 
                style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)', 
                    overflow: 'hidden', 
                    maxWidth: '1000px',
                    maxHeight: '90vh',
                    width: '100%'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 40px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h5 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>Detalles del Vehículo</h5>
                    <button 
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '2rem', color: '#64748b', cursor: 'pointer', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        ×
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                        Cargando...
                    </div>
                ) : vehicle ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                        <div style={{ width: '100%', minHeight: '400px', background: 'linear-gradient(135deg, #380cd8 0%, #2e04c5 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <span style={{ fontSize: '5rem', fontWeight: '700', letterSpacing: '8px', marginBottom: '16px' }}>
                                {vehicle.brand.charAt(0)}{vehicle.model.charAt(0)}
                            </span>
                            <p style={{ fontSize: '1.2rem', opacity: '0.8', margin: 0 }}>Sin imagen</p>
                        </div>

                        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                                    {vehicle.brand} {vehicle.model}
                                </h2>

                                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#380cd8', margin: '24px 0' }}>
                                    {vehicle.dailyPrice} € / día
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '1.1rem' }}>
                                        <strong style={{ color: '#0f172a' }}>Año de fabricación:</strong> {vehicle.manufactureYear}
                                    </li>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '1.1rem' }}>
                                        <strong style={{ color: '#0f172a' }}>Matrícula:</strong> {vehicle.licensePlate}
                                    </li>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '1.1rem' }}>
                                        <strong style={{ color: '#0f172a' }}>VIN:</strong> {vehicle.vinNumber}
                                    </li>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '1.1rem' }}>
                                        <strong style={{ color: '#0f172a' }}>Kilometraje:</strong> {vehicle.currentMileage.toLocaleString()} km
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