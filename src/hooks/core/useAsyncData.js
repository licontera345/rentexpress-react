import { useCallback, useEffect, useRef, useState } from 'react';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

/**
 * Hook genérico para cargar cualquier dato de forma asíncrona (objeto, lista cruda, etc.).
 * Igual que useAsyncList pero sin aplicar getResultsList: guarda el resultado tal cual.
 * Útil para dashboard (varios datos en uno), config (filterRanges), etc.
 *
 * @param {Function} fetcher - Función async () => any
 * @param {Array} deps - Dependencias para re-ejecutar
 * @param {Object} options - { skip?: boolean, errorMessage?: string }
 * @returns {{ data: any, loading: boolean, error: string|null, reload: Function }}
 */
function useAsyncData(fetcher, deps = [], options = {}) {
  const { skip = false, errorMessage = 'Error al cargar datos' } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (skip) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }
      try {
        startAsyncLoad(setLoading, setError);
        const result = await fetcherRef.current();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || errorMessage);
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-provided
  }, [skip, errorMessage, reloadKey, ...deps]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, loading, error, reload };
}

export default useAsyncData;
