import { useState, useEffect, useMemo } from 'react';
import { SedeService } from '../../api/services/CatalogService';
import {
  enrichHeadquartersWithAddresses,
  buildHeadquartersMap
} from '../../utils/location/headquartersUtils';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

const useHeadquarters = () => {
  const [headquarters, setHeadquarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeadquarters = async () => {
      try {
        startAsyncLoad(setLoading, setError);
        const data = await SedeService.getAll();
        const enriched = await enrichHeadquartersWithAddresses(data || []);
        setHeadquarters(enriched);
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
