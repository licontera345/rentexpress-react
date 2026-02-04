import { useEffect, useState } from 'react';
import ProvinceService from '../api/services/ProvinceService';

// Hook que carga la lista de provincias desde la API.
const useProvinces = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Consulta el backend una sola vez al montar el componente.
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const data = await ProvinceService.findAll();
        setProvinces(data || []);
        setError(null);
      } catch (err) {
        setError(err?.message || 'Error al cargar provincias');
        setProvinces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return { provinces, loading, error };
};

export default useProvinces;
