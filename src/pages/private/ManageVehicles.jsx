import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import useVehicleManagement from '../../hooks/useVehicleManagement';
import VehicleListItem from '../../components/common/VehicleListItem';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManageVehicles.css';

function ManageVehicles() {
  const navigate = useNavigate();
  const { vehicles, loading, deleteVehicle } = useVehicleManagement();

  const handleDelete = async (vehicleId) => {
    if (window.confirm('¿Eliminar este vehículo?')) {
      try {
        await deleteVehicle(vehicleId);
      } catch (err) {
        console.error('Error deleting vehicle:', err);
      }
    }
  };

  const handleEdit = (vehicleId) => {
    navigate(`/edit-vehicle/${vehicleId}`);
  };

  return (
    <PrivateLayout>
      <div className="manage-vehicles-container">
        <div className="manage-header">
          <h1>Mis Vehículos</h1>
          <Button variant="primary" onClick={() => navigate('/add-vehicle')}>
            Agregar Vehículo
          </Button>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && vehicles && vehicles.length === 0 ? (
          <div className="empty-state">
            <p>No hay vehículos registrados</p>
          </div>
        ) : (
          <div className="vehicles-list">
            {vehicles?.map(vehicle => (
              <VehicleListItem
                key={vehicle.id || vehicle.vehicleId}
                vehicle={vehicle}
                onEdit={() => handleEdit(vehicle.id || vehicle.vehicleId)}
                onDelete={() => handleDelete(vehicle.id || vehicle.vehicleId)}
              />
            ))}
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}

export default ManageVehicles;