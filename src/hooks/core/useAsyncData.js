import { useCallback, useEffect, useRef, useState } from 'react';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

function useAsyncData(fetcher, deps = [], options = {}) {
  const { skip = false, errorMessage = 'Error al cargar datos', } = options;
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

  return { data, loading, error, reload, };
}

export default useAsyncData;
