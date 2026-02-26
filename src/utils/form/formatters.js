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

// Formatea una fecha en formato de fecha legible.
export const formatDate = (value, { fallback = null } = {}) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return date.toLocaleDateString();
};

// Formatea una fecha en formato de fecha y hora legible.
export const formatDateTime = (value, { fallback = null } = {}) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return date.toLocaleString();
};

// Obtiene el año actual.
export const getCurrentYear = () => new Date().getFullYear();

// Valor para inputs/selects controlados: null/undefined → '', 0 → '0', resto → String(value).
export const toFormControlValue = (value) => {
  if (value === null || value === undefined) return '';
  if (value === 0) return '0';
  return String(value);
};
