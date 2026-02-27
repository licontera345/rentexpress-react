import { useCallback, useRef, useState } from 'react';

/**
 * Ejecuta una función async bajo demanda y expone { data, error, loading, run, reset }.
 * run(fn) donde fn es () => Promise. Útil para: getById, submit, cualquier operación puntual.
 */
export function useAsync() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const cancelled = useRef(false);

  const run = useCallback(async (fn) => {
    if (typeof fn !== 'function') return undefined;
    cancelled.current = false;
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (!cancelled.current) {
        setData(result);
        setError(null);
      }
      return result;
    } catch (err) {
      if (!cancelled.current) {
        setError(err);
        setData(null);
      }
      throw err;
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    cancelled.current = true;
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, run, reset };
}

export default useAsync;
