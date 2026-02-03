const DEFAULT_LOCALE = 'es-ES';

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
