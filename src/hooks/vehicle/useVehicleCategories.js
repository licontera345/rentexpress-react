import { useMemo } from 'react';
import useAsyncList from '../core/useAsyncList';
import useLocale from '../core/useLocale';
import { VehicleCategoryService } from '../../api/services/CatalogService';

const useVehicleCategories = (isoCode) => {
  const locale = useLocale();
  const resolvedIsoCode = isoCode ?? locale;
  const { data: categories, loading, error } = useAsyncList(
    () => VehicleCategoryService.getAll(resolvedIsoCode),
    [resolvedIsoCode],
    { emptyMessage: 'Error al cargar categorías' }
  );

  // Crear un mapa de categorías para facilitar la búsqueda por ID
  const categoryMap = useMemo(() => (
    (categories || []).reduce((map, category) => {
      const id = category?.categoryId;
      const label = category?.categoryName;
      if (id != null && label) map.set(Number(id), label);
      return map;
    }, new Map())
  ), [categories]);

  return { categories, categoryMap, loading, error };
};

export default useVehicleCategories;
