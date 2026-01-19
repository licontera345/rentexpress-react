import { useState, useEffect } from 'react';
import CityService from '../api/services/CityService';

const useCities = (provinceId = null) => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!provinceId) {
            setCities([]);
            setLoading(false);
            return;
        }

        const fetchCities = async () => {
            try {
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
