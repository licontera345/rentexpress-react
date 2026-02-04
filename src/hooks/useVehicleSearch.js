import { useCallback, useState } from 'react';
import VehicleService from '../api/services/VehicleService';

/**
 * Hook de búsqueda de vehículos.
 * Encapsula la llamada al servicio y expone resultados, carga y error.
 */
// Hook que ejecuta búsquedas de vehículos con criterios dinámicos.
const useVehicleSearch = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchVehicles = useCallback(async (criteria) => {
        try {
            // Dispara la búsqueda y actualiza los resultados.
            setLoading(true);
            setError(null);
            const result = await VehicleService.search(criteria);
            setVehicles(result.results || []);
        } catch (err) {
            setError(err.message || 'Error en la búsqueda');
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { vehicles, loading, error, searchVehicles };
};

export default useVehicleSearch;
