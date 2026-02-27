import useAsyncList from '../core/useAsyncList';
import { CityService } from '../../api/services/CatalogService';

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
