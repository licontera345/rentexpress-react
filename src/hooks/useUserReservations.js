import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../api/services/ReservationService';
import { useAuth } from './useAuth';
import useLocale from './useLocale';
import { MESSAGES } from '../constants';
import {
  enrichReservations,
  normalizeReservationResults,
  resolveReservationErrorMessage
} from '../config/reservationData';

/**
 * Hook para listar reservas del usuario autenticado.
 * Resuelve el ID del usuario, ejecuta la búsqueda y expone estado de carga/error.
 */
// Resuelve el ID del usuario usando el nombre esperado por la API.
const resolveUserId = (user) => user?.userId;

// Hook que obtiene las reservas del usuario autenticado.
const useUserReservations = () => {
  const { user } = useAuth();
  const locale = useLocale();
  const userId = useMemo(() => resolveUserId(user), [user]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReservations = useCallback(async () => {
    if (!userId) {
      // Si no hay usuario, se limpia el estado y se muestra error.
      setReservations([]);
      setError(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    // Ejecuta la búsqueda por usuario actual.
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
