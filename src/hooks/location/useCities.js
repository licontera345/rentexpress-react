import useAsyncList from '../core/useAsyncList';
import { CityService } from '../../api/services/CatalogService';

/**
 * Hook de ciudades por provincia. No hace fetch si no hay provinceId.
 * Delega en useAsyncList (genérico).
 */
const useCities = (provinceId = null) => {
  // Carga las ciudades por provincia.
  const { data, loading, error } = useAsyncList(
    () => CityService.findByProvinceId(provinceId),
    [provinceId],
    { skip: !provinceId, emptyMessage: 'Error al cargar ciudades' }
  );
  // Estado y callbacks para el hook.
  return { cities: data, loading, error };
};

export default useCities;
