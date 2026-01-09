import { useState } from 'react';
import SearchPanel from '../components/SearchPanel';
import VehicleCard from '../components/VehicleCard';
import VehicleDetailModal from '../components/VehicleDetailModal';
import { VehicleService } from '../services/api';

const CatalogPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSearch = async (params) => {
        setLoading(true);
        try {
            const results = await VehicleService.search({
                currentHeadquartersId: params.pickupHeadquartersId,
                activeStatus: true,
                pageNumber: 1,
                pageSize: 25
            });
            setVehicles(results.results || []);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVehicleClick = (vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVehicleId(null);
    };

    return (
        <div>
            <SearchPanel onSearch={handleSearch} />

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: '16px', color: '#64748b', fontSize: '1.3rem' }}>
                    Buscando vehículos...
                </div>
            ) : vehicles.length > 0 ? (
                <section style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: '#0f172a' }}>
                        Vehículos Disponibles
                    </h2>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#380cd8', marginBottom: '24px' }}>
                        {vehicles.length} vehículos
                    </p>
                    <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', padding: 0, margin: 0 }}>
                        {vehicles.map(vehicle => (
                            <VehicleCard 
                                key={vehicle.vehicleId} 
                                vehicle={vehicle} 
                                onClick={handleVehicleClick}
                            />
                        ))}
                    </ul>
                </section>
            ) : (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', color: '#64748b', fontSize: '1.3rem' }}>
                    Utiliza el buscador para encontrar vehículos disponibles
                </div>
            )}

            <VehicleDetailModal 
                vehicleId={selectedVehicleId}
                isOpen={showModal}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default CatalogPage;