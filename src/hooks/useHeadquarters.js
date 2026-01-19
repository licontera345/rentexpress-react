import { useState, useEffect } from 'react';
import SedeService from '../api/services/SedeService';

const useHeadquarters = () => {
    const [headquarters, setHeadquarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeadquarters = async () => {
            try {
                setLoading(true);
                const data = await SedeService.getAll();
                setHeadquarters(data || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar sedes');
                setHeadquarters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHeadquarters();
    }, []);

    return { headquarters, loading, error };
};

export default useHeadquarters;
