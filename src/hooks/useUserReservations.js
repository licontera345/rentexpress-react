import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../api/services/ReservationService';
import { useAuth } from './useAuth';
import useLocale from './useLocale';
import { getId } from '../config/entityNormalizers';
import {
  enrichReservations,
  normalizeReservationResults,
  resolveReservationErrorMessage
} from '../config/reservationData';

const resolveUserId = (user) => getId(user, 'userId', 'id');

const useUserReservations = () => {
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
      const normalizedReservations = normalizeReservationResults(result);
      const hydratedReservations = await enrichReservations(normalizedReservations, {
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
    reservations,
    loading,
    error,
    reload: loadReservations
  };
};

export default useUserReservations;
