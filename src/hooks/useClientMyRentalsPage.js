import { MESSAGES, ROUTES } from '../constants';

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
