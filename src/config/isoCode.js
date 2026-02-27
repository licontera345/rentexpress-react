/**
 * ISO para APIs: 2 letras mayúsculas (ES, EN, FR).
 * package-rentexpress.json usa estos valores; no normalizar otros atributos.
 */
export const normalizeIsoCodeForApi = (value, fallback = 'ES') => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.split('-')[0].slice(0, 2).toUpperCase();
};
