import { useState, useEffect, useMemo } from 'react';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import useLocale from './useLocale';

/**
 * Hook de categorías de vehículos.
 * Permite forzar el idioma vía isoCode y actualiza el catálogo cuando cambia.
 */
// Hook que carga categorías de vehículos según idioma.
const useVehicleCategories = (isoCode) => {
    const locale = useLocale();
    const resolvedIsoCode = isoCode ?? locale;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Consulta la API cada vez que cambia el locale.
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await VehicleCategoryService.getAll(resolvedIsoCode);
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
    }, [resolvedIsoCode]);

    const categoryMap = useMemo(() => (
        categories.reduce((map, category) => {
            const id = category?.categoryId;
            const label = category?.categoryName;
            if (id != null && label) {
                map.set(Number(id), label);
            }
            return map;
        }, new Map())
    ), [categories]);

    return {
        categories,
        categoryMap,
        loading,
        error
    };
};

export default useVehicleCategories;
