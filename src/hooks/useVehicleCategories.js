import { useState, useEffect } from 'react';
import VehicleCategoryService from '../api/services/VehicleCategoryService';

const useVehicleCategories = (isoCode = 'es') => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await VehicleCategoryService.getAll(isoCode);
                setCategories(data || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar categorías');
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [isoCode]);

    return { categories, loading, error };
};

export default useVehicleCategories;
