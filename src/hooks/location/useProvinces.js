import useAsyncList from '../core/useAsyncList';
import ProvinceService from '../../api/services/ProvinceService';

/**
 * Hook de provincias. Carga la lista una vez al montar.
 * Delega en useAsyncList (genérico).
 */
const useProvinces = () => {
  const { data, loading, error } = useAsyncList(
    () => ProvinceService.findAll(),
    [],
    { emptyMessage: 'Error al cargar provincias' }
  );
  return { provinces: data, loading, error };
};

export default useProvinces;
