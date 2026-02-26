import { useCallback, useEffect, useMemo, useState } from 'react';
import RentalService from '../../api/services/RentalService';
import { RentalStatusService } from '../../api/services/CatalogService';
import { MESSAGES, ROUTES } from '../../constants';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { resolveUserId } from '../../utils/ui/uiUtils';
import { useAuth } from '../core/useAuth';
import useLocale from '../core/useLocale';
import useHeadquarters from '../location/useHeadquarters';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

export function useClientMyRentalsPage() {
  const { user } = useAuth();
  const locale = useLocale();
  const { headquarters } = useHeadquarters();
  const userId = resolveUserId(user);

  const [rentals, setRentals] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStatuses = useCallback(async () => {
    try {
      const list = await RentalStatusService.getAll(locale);
      setStatuses(getResultsList(list));
    } catch {
      setStatuses([]);
    }
  }, [locale]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const loadRentals = useCallback(async () => {
    if (!userId) {
      setRentals([]);
      setError(MESSAGES.LOGIN_REQUIRED);
      return;
    }
    startAsyncLoad(setLoading, setError);
    try {
      const result = await RentalService.search({ userId });
      setRentals(getResultsList(result));
    } catch (err) {
      setRentals([]);
      setError(err?.response?.data?.message ?? err?.message ?? MESSAGES.ERROR_LOADING_DATA);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadRentals();
  }, [loadRentals]);

  const headquartersById = useMemo(
    () => new Map((headquarters || []).map((hq) => [Number(hq.id), hq])),
    [headquarters]
  );
  const statusById = useMemo(
    () => new Map((statuses || []).map((s) => [Number(s.rentalStatusId), s])),
    [statuses]
  );

  return {
    state: {
      rentals,
      headquarters,
      statuses,
      headquartersById,
      statusById,
      emptyMessage: MESSAGES.MY_RENTALS_EMPTY,
    },
    ui: {
      isLoading: loading,
      error,
    },
    actions: {
      reload: loadRentals,
    },
    options: {
      hasRentals: rentals.length > 0,
      catalogRoute: ROUTES.CATALOG,
    },
  };
}
