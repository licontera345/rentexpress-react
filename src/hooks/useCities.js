import { useState, useEffect } from 'react';
import CityService from '../api/services/CityService';

/**
 * Hook de ciudades dependientes de una provincia.
 * Gestiona carga, error y la limpieza de resultados cuando no hay provincia seleccionada.
 */
// Hook que carga ciudades según la provincia seleccionada.
const useCities = (provinceId = null) => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!provinceId) {
            // Si no hay provincia, se limpian los datos.
            setCities([]);
            setError(null);
            setLoading(false);
            return;
        }

        const fetchCities = async () => {
            try {
                // Se consulta la API por ciudades de la provincia indicada.
                setLoading(true);
                const data = await CityService.findByProvinceId(provinceId);
                setCities(data || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar ciudades');
                setCities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, [provinceId]);

    return { cities, loading, error };
};

export default useCities;
