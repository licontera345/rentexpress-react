import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../api/services/ReservationService';
import { useAuth } from './useAuth';
import { MESSAGES } from '../constants';

const resolveUserId = (user) => user?.userId || user?.id || null;

const normalizeReservations = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
};

const resolveErrorMessage = (err) => {
  if (!err) return MESSAGES.UNEXPECTED_ERROR;

  switch (err.status) {
    case 401:
      return MESSAGES.SESSION_EXPIRED || MESSAGES.UNAUTHORIZED;
    case 403:
      return MESSAGES.FORBIDDEN;
    case 404:
      return MESSAGES.NOT_FOUND;
    default:
      return err.message || MESSAGES.UNEXPECTED_ERROR;
  }
};

const useUserReservations = () => {
  const { user, token } = useAuth();
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
      const result = await ReservationService.search({ userId }, token);
      setReservations(normalizeReservations(result));
    } catch (err) {
      setReservations([]);
      setError(resolveErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

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
