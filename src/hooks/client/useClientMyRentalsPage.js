import { MESSAGES, ROUTES } from '../../constants';

export function useClientMyRentalsPage() {
  return {
    state: { emptyMessage: MESSAGES.MY_RENTALS_EMPTY },
    ui: {},
    actions: {},
    meta: { catalogRoute: ROUTES.CATALOG },
  };
}
