import { useEffect, useRef, useState } from 'react';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

const useAsyncList = (fetcher, deps = [], options = {}) => {
  const { skip = false, emptyMessage = 'Error al cargar datos' } = options;
  // Estado de la lista.
  const [data, setData] = useState([]);
  // Estado de carga.
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  // Referencia al fetcher.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Carga la lista.
  useEffect(() => {
    if (skip) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        startAsyncLoad(setLoading, setError);
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(getResultsList(result));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || emptyMessage);
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  // Solo re-ejecutar cuando cambian skip, emptyMessage o las deps explícitas (no fetcher).
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-provided; fetcher intentionally excluded to prevent infinite requests
  }, [skip, emptyMessage, ...deps]);

  return { data, loading, error };
};

export default useAsyncList;
