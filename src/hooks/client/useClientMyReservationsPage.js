import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import { ReservationStatusService } from '../../api/services/CatalogService';
import { useAuth } from '../core/useAuth';
import useLocale from '../core/useLocale';
import useHeadquarters from '../location/useHeadquarters';
import { MESSAGES } from '../../constants';
import { resolveReservationErrorMessage } from '../../utils/apiFormUtils';

const resolveUserId = (user) => user?.userId;

/**
 * Hook para la página "Mis reservas" del cliente.
 * Carga reservas del usuario autenticado, estados de reserva y sedes; expone recarga y estado de carga/error.
 */
const useClientMyReservationsPage = () => {
  const { user } = useAuth();
  const locale = useLocale();
  const { headquarters } = useHeadquarters();
  const userId = useMemo(() => resolveUserId(user), [user]);
  const [reservations, setReservations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga los estados de reserva.
  useEffect(() => {
    let cancelled = false;
    // Carga los estados de reserva.
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

  // Carga las reservas del usuario.
  const loadReservations = useCallback(async () => {
    if (!userId) {
      setReservations([]);
      setError(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    // Inicia el estado de carga.
    setLoading(true);
    // Limpia el error.
    setError(null);

    try {
      // Busca las reservas del usuario.
      const result = await ReservationService.search({ userId });
      setReservations(result?.results ?? []);
    } catch (err) {
      setReservations([]);
      setError(resolveReservationErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Carga las reservas del usuario.
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    state: {
      reservations,
      headquarters,
      statuses
    },
    // Interfaz de usuario de la página.
    ui: {
      isLoading: loading,
      error
    },
    // Acciones de la página.
    actions: {
      reload: loadReservations
    },
    // Metadatos de la página.
    meta: {
      hasReservations: reservations.length > 0
    }
  };
};

export default useClientMyReservationsPage;
