import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import ReservationStatusService from '../../api/services/ReservationStatusService';
import { useAuth } from '../core/useAuth';
import useLocale from '../core/useLocale';
import useHeadquarters from '../location/useHeadquarters';
import { MESSAGES } from '../../constants';
import {
  resolveReservationErrorMessage
} from '../../utils/reservationData';

const resolveUserId = (user) => user?.userId;

const useClientMyReservationsPage = () => {
  const { user } = useAuth();
  const locale = useLocale();
  const { headquarters } = useHeadquarters();
  const userId = useMemo(() => resolveUserId(user), [user]);
  const [reservations, setReservations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadStatuses = async () => {
      try {
        const data = await ReservationStatusService.getAll(locale);
        if (!cancelled) setStatuses(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setStatuses([]);
      }
    };
    loadStatuses();
    return () => { cancelled = true; };
  }, [locale]);

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
      setReservations(result?.results ?? []);
    } catch (err) {
      setReservations([]);
      setError(resolveReservationErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    state: {
      reservations,
      headquarters,
      statuses
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
