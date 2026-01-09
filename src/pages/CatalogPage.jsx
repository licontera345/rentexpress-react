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
                <div className="catalog-loading">
                    Buscando vehículos...
                </div>
            ) : vehicles.length > 0 ? (
                <section className="catalog-results">
                    <h2 className="catalog-title">Vehículos Disponibles</h2>
                    <p className="catalog-count">{vehicles.length} vehículos</p>
                    <ul className="catalog-grid">
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
                <div className="catalog-empty">
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