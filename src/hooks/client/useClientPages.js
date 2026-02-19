/**
 * Barrel: re-exporta los hooks de páginas de cliente.
 * Para importaciones directas, usa los archivos individuales.
 */
import { MESSAGES, ROUTES } from '../../constants';

/** Configuración compartida de páginas cliente que solo exponen estado/options estático (sin lógica). */
const CLIENT_PAGE_OPTIONS = {
  myRentals: {
    state: { emptyMessage: MESSAGES.MY_RENTALS_EMPTY },
    ui: {},
    actions: {},
    options: { catalogRoute: ROUTES.CATALOG },
  },
};

/** Hook genérico para páginas cliente que solo necesitan config (ej. My Rentals). */
export function useClientPageOptions(pageKey) {
  const config = CLIENT_PAGE_OPTIONS[pageKey];
  return config ?? { state: {}, ui: {}, actions: {}, options: {} };
}

export function useClientMyRentalsPage() {
  return useClientPageOptions('myRentals');
}

export { useClientMyReservationsPage } from './useClientMyReservationsPage';
export { useClientProfilePage } from './useClientProfilePage';
export { useClientReservationCreatePage } from './useClientReservationCreatePage';
