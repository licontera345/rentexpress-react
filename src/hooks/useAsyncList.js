import { useCallback, useEffect, useRef, useState } from 'react';
import { getResultsList } from '../utils/api.js';

/**
 * Carga una lista cuando cambian las dependencias. No paginación.
 * fetcher(): Promise. deps = array de deps para useEffect.
 * Útil para: roles, sedes, provincias, categorías, etc.
 */
export function useAsyncList(fetcher, deps = [], options = {}) {
  const { skip = false } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const ref = useRef(fetcher);
  ref.current = fetcher;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ref.current();
      setData(getResultsList(response));
    } catch (err) {
      setError(err?.message ?? err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skip) {
      setData([]);
      setError(null);
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ref.current();
        if (!cancelled) setData(getResultsList(response));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message ?? err);
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [skip, ...deps]);

  return { data, loading, error, reload: load };
}

export default useAsyncList;
