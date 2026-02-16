// Utilidades para normalizar y traducir estados de reservas.
// Nota: este módulo NO depende de `MESSAGES` para evitar ciclos de importación
// (por ejemplo, `src/constants/*` también lo usa).
const stripDiacritics = (value) => {
  if (typeof value !== 'string') return '';
  try {
    // Normaliza y elimina marcas combinadas (acentos) en rango Unicode común.
    // Esto evita depender de `\p{...}` que no está soportado en todos los runtimes.
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch {
    return value;
  }
};

export const normalizeReservationStatusToken = (value) => {
  if (typeof value !== 'string') return '';
  const normalized = stripDiacritics(value)
    .trim()
    .toLowerCase()
    // separadores comunes → underscore
    .replace(/[\s-]+/g, '_')
    // elimina caracteres raros
    .replace(/[^\w]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalized;
};

const CANONICAL_BY_TOKEN = {
  // pending
  pending: 'pending',
  pendiente: 'pending',
  en_attente: 'pending',
  awaiting: 'pending',
  on_hold: 'pending',

  // confirmed
  confirmed: 'confirmed',
  confirmada: 'confirmed',
  confirmado: 'confirmed',
  confirmee: 'confirmed',
  confirme: 'confirmed',

  // canceled
  canceled: 'canceled',
  cancelled: 'canceled',
  cancelada: 'canceled',
  cancelado: 'canceled',
  annulee: 'canceled',
  annule: 'canceled',

  // completed
  completed: 'completed',
  completada: 'completed',
  completado: 'completed',
  terminee: 'completed',
  termine: 'completed',

  // active
  active: 'active',
  activa: 'active',
  activo: 'active',
};

export const getReservationStatusCanonical = (statusName) => {
  const token = normalizeReservationStatusToken(statusName);
  return CANONICAL_BY_TOKEN[token] || '';
};

const MESSAGE_KEY_BY_CANONICAL = {
  pending: 'RESERVATION_STATUS_PENDING',
  confirmed: 'RESERVATION_STATUS_CONFIRMED',
  canceled: 'RESERVATION_STATUS_CANCELED',
  completed: 'RESERVATION_STATUS_COMPLETED',
  active: 'RESERVATION_STATUS_ACTIVE',
};

export const getReservationStatusMessageKey = (statusName) => {
  const canonical = getReservationStatusCanonical(statusName);
  return canonical ? MESSAGE_KEY_BY_CANONICAL[canonical] : null;
};
