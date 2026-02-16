import { MESSAGES, ROUTES } from '../../constants';

/**
 * Hook para la página "Mis alquileres" del cliente.
 * Expone mensaje vacío y ruta al catálogo para acciones rápidas.
 */
const useClientMyRentalsPage = () => ({
  state: {
    emptyMessage: MESSAGES.MY_RENTALS_EMPTY
  },
  ui: {},
  actions: {},
  meta: {
    catalogRoute: ROUTES.CATALOG
  }
});

export default useClientMyRentalsPage;
