import { useMemo } from 'react';
import useAsyncList from './useAsyncList';

/**
 * Hook para listas de catálogo: carga una lista y opcionalmente un mapa por ID.
 * Reduce duplicación en hooks como useVehicleCategories, useVehicleStatuses, etc.
 *
 * @param {Function} fetcher - () => Promise<array|response>
 * @param {Array} deps - Dependencias para re-ejecutar
 * @param {Object} options - { skip?, emptyMessage?, idKey? } idKey = clave numérica del ítem (ej. 'categoryId', 'reservationStatusId')
 * @returns {{ data, loading, error, reload, dataById: Map }}
 */
function useCatalogList(fetcher, deps = [], options = {}) {
  const { idKey = 'id', ...rest } = options;
  const { data, loading, error, reload } = useAsyncList(fetcher, deps, rest);

  const dataById = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return new Map(list.map((item) => {
      const id = item[idKey] ?? item.id;
      return [Number(id), item];
    }).filter(([id]) => !Number.isNaN(id)));
  }, [data, idKey]);

  return { data, loading, error, reload, dataById };
}

export default useCatalogList;
