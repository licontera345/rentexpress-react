/**
 * Normaliza un locale/isoCode de la UI a lo que suele esperar el backend.
 *
 * Ejemplos:
 * - "es" -> "ES"
 * - "es-ES" -> "ES"
 * - "EN" -> "EN"
 */
export const normalizeIsoCodeForApi = (value, fallback = 'ES') => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.split('-')[0].slice(0, 2).toUpperCase();
};

