import { useState, useEffect, useMemo } from 'react';
import { SedeService } from '../../api/services/CatalogService';
import {
  enrichHeadquartersWithAddresses,
  buildHeadquartersMap
} from '../../utils/headquartersUtils';

/**
 * Hook que obtiene sedes y garantiza que tengan dirección asociada.
 * Si la sede no incluye dirección embebida, la resuelve vía API.
 */
const useHeadquarters = () => {
  const [headquarters, setHeadquarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeadquarters = async () => {
      try {
        setLoading(true);
        const data = await SedeService.getAll();
        const enriched = await enrichHeadquartersWithAddresses(data || []);
        setHeadquarters(enriched);
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

  const headquartersMap = useMemo(() => buildHeadquartersMap(headquarters), [headquarters]);

    return {
        headquarters,
        headquartersMap,
        loading,
        error
    };
};

export default useHeadquarters;
