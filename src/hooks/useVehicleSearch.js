import { useState } from 'react';
import VehicleService from '../api/services/VehicleService';

const useVehicleSearch = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchVehicles = async (criteria) => {
        try {
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
    };

    return { vehicles, loading, error, searchVehicles };
};

export default useVehicleSearch;
