import { MESSAGES, ROUTES } from '../../constants';

// Hook para la página de alquileres del cliente.
export function useClientMyRentalsPage() {
  // Estado y callbacks para el hook.
  return {
    state: { emptyMessage: MESSAGES.MY_RENTALS_EMPTY },
    ui: {},
    actions: {},
    meta: { catalogRoute: ROUTES.CATALOG },
  };
}
