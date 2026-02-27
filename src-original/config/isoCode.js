export const normalizeIsoCodeForApi = (value, fallback = 'ES') => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.split('-')[0].slice(0, 2).toUpperCase();
};

export const normalizeIsoCodeForComparison = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';
