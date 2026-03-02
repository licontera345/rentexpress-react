import { useCallback, useEffect, useRef, useState } from 'react';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

/**
 * Hook genérico para cargar una lista de forma asíncrona (una vez o cuando cambian deps).
 * Reutilizable para catálogos (provincias, ciudades, estados, sedes) y listas simples.
 *
 * @param {Function} fetcher - Función async () => result (se pasa a getResultsList si no es array)
 * @param {Array} deps - Dependencias para re-ejecutar la carga (p. ej. [locale], [provinceId])
 * @param {Object} options - { skip?: boolean, emptyMessage?: string }
 * @returns {{ data: Array, loading: boolean, error: string|null, reload: Function }}
 */
const useAsyncList = (fetcher, deps = [], options = {}) => {
  const { skip = false, emptyMessage = 'Error al cargar datos' } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (skip) {
        setData([]);
        setError(null);
        setLoading(false);
        return;
      }
      try {
        startAsyncLoad(setLoading, setError);
        const result = await fetcherRef.current();
        if (!cancelled) setData(getResultsList(result));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || emptyMessage);
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-provided; fetcher intentionally excluded
  }, [skip, emptyMessage, reloadKey, ...deps]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, loading, error, reload };
};

export default useAsyncList;
