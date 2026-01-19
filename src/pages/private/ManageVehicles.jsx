import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import useVehicleManagement from '../../hooks/useVehicleManagement';
import VehicleListItem from '../../components/common/VehicleListItem';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../../constants';
import './ManageVehicles.css';

function ManageVehicles() {
  const navigate = useNavigate();
  const { vehicles, loading, deleteVehicle } = useVehicleManagement();

  const handleDelete = async (vehicleId) => {
    if (window.confirm(MESSAGES.CONFIRM_DELETE_VEHICLE)) {
      try {
        await deleteVehicle(vehicleId);
      } catch (err) {
        console.error('Error deleting vehicle:', err);
      }
    }
  };

  const handleEdit = (vehicleId) => {
    navigate(ROUTES.EDIT_VEHICLE.replace(':id', vehicleId));
  };

  return (
    <PrivateLayout>
      <div className="manage-vehicles-container">
        <div className="manage-header">
          <h1>{MESSAGES.MANAGE_VEHICLES}</h1>
          <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={() => navigate(ROUTES.ADD_VEHICLE)}>
            {MESSAGES.ADD_VEHICLE}
          </Button>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && vehicles && vehicles.length === 0 ? (
          <div className="empty-state">
            <p>{MESSAGES.EMPTY_VEHICLES}</p>
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