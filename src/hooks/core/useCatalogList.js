import { useMemo } from 'react';
import useAsyncList from './useAsyncList';

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

  return { data, loading, error, reload, dataById, };
}

export default useCatalogList;
