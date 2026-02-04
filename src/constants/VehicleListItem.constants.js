import { MESSAGES } from '.';

// Constantes del listado de vehículos (deberían vivir en un archivo de constantes dedicado).
export const STATUS_CONFIG = {
  1: { label: MESSAGES.AVAILABLE, class: 'status-available' },
  2: { label: MESSAGES.MAINTENANCE, class: 'status-maintenance' },
  3: { label: MESSAGES.RENTED, class: 'status-rented' }
};

// Traduce nombres de estado a clases CSS cuando llega texto libre.
export const STATUS_NAMES = {
  available: 'status-available',
  disponible: 'status-available',
  maintenance: 'status-maintenance',
  mantenimiento: 'status-maintenance',
  rented: 'status-rented',
  alquilado: 'status-rented',
  loue: 'status-rented'
};
