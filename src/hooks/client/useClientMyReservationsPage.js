import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import { useAuth } from '../core/useAuth';
import useLocale from '../core/useLocale';
import { MESSAGES } from '../../constants';
import {
  enrichReservations,
  resolveReservationErrorMessage
} from '../../utils/reservationData';

const resolveUserId = (user) => user?.userId;

const useClientMyReservationsPage = () => {
  const { user } = useAuth();
  const locale = useLocale();
  const userId = useMemo(() => resolveUserId(user), [user]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReservations = useCallback(async () => {
    if (!userId) {
      setReservations([]);
      setError(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await ReservationService.search({ userId });
      const hydratedReservations = await enrichReservations(result?.results ?? [], {
        canFetchStatuses: true,
        isoCode: locale
      });
      setReservations(hydratedReservations);
    } catch (err) {
      setReservations([]);
      setError(resolveReservationErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [locale, userId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    state: {
      reservations
    },
    ui: {
      isLoading: loading,
      error
    },
    actions: {
      reload: loadReservations
    },
    meta: {
      hasReservations: reservations.length > 0
    }
  };
};

export default useClientMyReservationsPage;
