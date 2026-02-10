// Locale por defecto para formateos numéricos.
const DEFAULT_LOCALE = 'es-ES';

// Formatea un valor como moneda respetando locale y divisa.
export const formatCurrency = (
  value,
  { locale = DEFAULT_LOCALE, currency = 'EUR', fallback = null } = {}
) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(numeric);
};

// Formatea un valor como número simple (sin símbolo de moneda).
export const formatNumber = (
  value,
  { locale = DEFAULT_LOCALE, fallback = null } = {}
) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return new Intl.NumberFormat(locale).format(numeric);
};
