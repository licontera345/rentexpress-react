import { useEffect, useState } from 'react';

/**
 * Hook genérico para cargar una lista desde una API.
 * Reutilizable para provincias, ciudades, estados de vehículo, categorías, etc.
 *
 * @param {() => Promise<any[]>} fetcher - Función que devuelve la promesa con la lista.
 * @param {Array} deps - Dependencias para volver a ejecutar (ej. [] una vez, [id] cuando cambie).
 * @param {{ skip?: boolean, emptyMessage?: string }} [options] - skip: si true no hace fetch y devuelve vacío; emptyMessage: mensaje de error.
 * @returns {{ data: any[], loading: boolean, error: string | null }}
 */
const useAsyncList = (fetcher, deps = [], options = {}) => {
  const { skip = false, emptyMessage = 'Error al cargar datos' } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

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
        setLoading(true);
        setError(null);
        const result = await fetcher();
        if (!cancelled) {
          setData(Array.isArray(result) ? result : []);
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
  }, [...deps, skip]);

  return { data, loading, error };
};

export default useAsyncList;
