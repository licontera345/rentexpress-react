import { useMemo } from 'react';
import RentalService from '../../api/services/RentalService';
import { RentalStatusService } from '../../api/services/CatalogService';
import { MESSAGES, ROUTES } from '../../constants';
import { resolveUserId } from '../../utils/ui/uiUtils';
import { useAuth } from '../core/useAuth';
import useLocale from '../core/useLocale';
import useAsyncList from '../core/useAsyncList';
import useCatalogList from '../core/useCatalogList';
import useHeadquarters from '../location/useHeadquarters';

export function useClientMyRentalsPage() {
  const { user } = useAuth();
  const locale = useLocale();
  const { headquarters } = useHeadquarters();
  const userId = resolveUserId(user);

  const {
    data: rentals,
    loading,
    error: rentalsError,
    reload: loadRentals,
  } = useAsyncList(
    () => RentalService.search({ userId }),
    [userId],
    { skip: !userId, emptyMessage: MESSAGES.ERROR_LOADING_DATA },
  );

  const { data: statuses, dataById: statusById } = useCatalogList(
    () => RentalStatusService.getAll(locale),
    [locale],
    { emptyMessage: 'Error al cargar estados', idKey: 'rentalStatusId' },
  );

  const displayError = !userId ? MESSAGES.LOGIN_REQUIRED : rentalsError;

  const headquartersById = useMemo(
    () => new Map((headquarters || []).map((hq) => [Number(hq.id), hq])),
    [headquarters],
  );

  return {
    state: {
      rentals: rentals || [],
      headquarters,
      statuses: statuses || [],
      headquartersById,
      statusById,
      emptyMessage: MESSAGES.MY_RENTALS_EMPTY,
    },
    ui: {
      isLoading: loading,
      error: displayError,
    },
    actions: {
      reload: loadRentals,
    },
    options: {
      hasRentals: (rentals || []).length > 0,
      catalogRoute: ROUTES.CATALOG,
    },
  };
}
