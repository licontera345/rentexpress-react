import useAsyncList from '../core/useAsyncList';
import { ProvinceService } from '../../api/services/CatalogService';

const useProvinces = () => {
  const { data, loading, error } = useAsyncList(
    () => ProvinceService.findAll(),
    [],
    { emptyMessage: 'Error al cargar provincias' }
  );
  return { provinces: data, loading, error };
};

export default useProvinces;
