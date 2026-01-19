import { useState, useCallback } from 'react';
import VehicleService from '../api/services/VehicleService';

function useVehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Esta función requiere que el usuario esté autenticado
      const result = await VehicleService.search({
        pageNumber: 1,
        pageSize: 100
      });
      setVehicles(result.vehicles || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message || 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (vehicleId) => {
    setLoading(true);
    setError(null);
    try {
      await VehicleService.delete(vehicleId);
      setVehicles(prev => prev.filter(v => v.vehicleId !== vehicleId));
      return true;
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError(err.message || 'Error al eliminar vehículo');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVehicle = useCallback(async (vehicleId, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await VehicleService.update(vehicleId, data);
      setVehicles(prev =>
        prev.map(v => v.vehicleId === vehicleId ? result : v)
      );
      return result;
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError(err.message || 'Error al actualizar vehículo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    vehicles,
    loading,
    error,
    fetchMyVehicles,
    deleteVehicle,
    updateVehicle
  };
}

export default useVehicleManagement;