import { useEffect, useRef, useState } from 'react';

/**
 * Hook genérico para cargar una lista desde una API.
 * Reutilizable para provincias, ciudades, estados de vehículo, categorías, etc.
 * No incluye fetcher en dependencias para evitar bucles: el fetcher se guarda en un ref
 * y solo se re-ejecuta cuando cambian skip o deps (p. ej. [provinceId]).
 *
 * @param {() => Promise<any[]>} fetcher - Función que devuelve la promesa con la lista.
 * @param {Array} deps - Dependencias para volver a ejecutar (ej. [] una vez, [id] cuando cambie).
 * @param {{ skip?: boolean, emptyMessage?: string }} [options] - skip: si true no hace fetch y devuelve vacío; emptyMessage: mensaje de error.
 * @returns {{ data: any[], loading: boolean, error: string | null }}
 */
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
        setLoading(true);
        setError(null);
        const result = await fetcherRef.current();
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
  // Solo re-ejecutar cuando cambian skip, emptyMessage o las deps explícitas (no fetcher).
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-provided; fetcher intentionally excluded to prevent infinite requests
  }, [skip, emptyMessage, ...deps]);

  return { data, loading, error };
};

export default useAsyncList;
