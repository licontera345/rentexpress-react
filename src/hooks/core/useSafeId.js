import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

/**
 * Parsea un ID de ruta como entero positivo de forma segura.
 * Útil para rutas con :id (ej. /reservations/:id).
 *
 * @param {string} [paramName='id'] - Nombre del parámetro en la ruta
 * @returns {{ id: number | null, isValid: boolean, redirectToNotFound: () => void }}
 *   - id: número si es válido, null si no existe o no es entero positivo
 *   - isValid: true si id es un número válido
 *   - redirectToNotFound: navega a /not-found (útil cuando !isValid)
 */
export function useSafeId(paramName = 'id') {
  const params = useParams();
  const navigate = useNavigate();
  const raw = params[paramName];

  const result = useMemo(() => {
    if (raw == null || raw === '') {
      return { id: null, isValid: false };
    }
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return { id: null, isValid: false };
    }
    return { id: parsed, isValid: true };
  }, [raw]);

  const redirectToNotFound = () => {
    navigate(ROUTES.NOT_FOUND, { replace: true });
  };

  return {
    ...result,
    redirectToNotFound,
  };
}

export default useSafeId;
