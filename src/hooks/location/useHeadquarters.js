import { useMemo } from 'react';
import { SedeService } from '../../api/services/CatalogService';
import {
  enrichHeadquartersWithAddresses,
  buildHeadquartersMap
} from '../../utils/location/headquartersUtils';
import useAsyncList from '../core/useAsyncList';

const useHeadquarters = () => {
  const { data: headquarters, loading, error, reload } = useAsyncList(
    async () => {
      const data = await SedeService.getAll();
      return enrichHeadquartersWithAddresses(data || []);
    },
    [],
    { emptyMessage: 'Error al cargar sedes' }
  );

  const headquartersMap = useMemo(() => buildHeadquartersMap(headquarters), [headquarters]);

  return {
    headquarters,
    headquartersMap,
    loading,
    error,
    reload
  };
};

export default useHeadquarters;
