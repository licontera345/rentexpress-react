import { useCallback, useEffect, useRef, useState } from 'react';
import VehicleService from '../../api/services/VehicleService';
import { MESSAGES } from '../../constants';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

const useVehicleDetail = (vehicleId) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // Controla el montaje para evitar setState después del unmount.
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadVehicle = useCallback(async (id = vehicleId) => {
    if (!id) {
      // Si no hay ID, limpia el estado.
      if (isMounted.current) {
        setVehicle(null);
        setError(null);
        setLoading(false);
      }
      return;
    }

    if (isMounted.current) {
      startAsyncLoad(setLoading, setError);
    }

    try {
      const data = await VehicleService.findById(id);
      if (isMounted.current) {
        // Guarda el detalle obtenido.
        setVehicle(data);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err?.message || MESSAGES.FETCH_VEHICLE_ERROR);
        setVehicle(null);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [vehicleId]);

  useEffect(() => {
    loadVehicle(vehicleId);
  }, [loadVehicle, vehicleId]);

  return {
    vehicle,
    loading,
    error,
    reload: loadVehicle
  };
};

export default useVehicleDetail;
