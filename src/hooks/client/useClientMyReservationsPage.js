import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import { ReservationStatusService } from '../../api/services/CatalogService';
import { MESSAGES } from '../../constants';
import { getResultsList } from '../../utils/apiResponseUtils';
import { resolveReservationErrorMessage } from '../../utils/apiFormUtils';
import { resolveUserId } from '../../utils/uiUtils';
import { useAuth } from '../core/useAuth';
import useLocale from '../core/useLocale';
import useHeadquarters from '../location/useHeadquarters';

// Hook para la página de reservas del cliente.
export function useClientMyReservationsPage() {
  // Obtiene el usuario.
  const { user } = useAuth();
  // Obtiene el idioma.
  const locale = useLocale();
  // Obtiene las sedes.
  const { headquarters } = useHeadquarters();
  // Obtiene el identificador del usuario.
  const userId = useMemo(() => resolveUserId(user), [user]);
  // Estado de las reservas.
  const [reservations, setReservations] = useState([]);
  // Estado de los estados de reserva.
  const [statuses, setStatuses] = useState([]);
  // Estado de carga.
  const [loading, setLoading] = useState(false);
  // Estado de error.
  const [error, setError] = useState(null);

  // Carga los estados de reserva.
  useEffect(() => {
    let cancelled = false;
    const loadStatuses = async () => {
      try {
        const data = await ReservationStatusService.getAll(locale);
        if (!cancelled) setStatuses(getResultsList(data));
      } catch {
        if (!cancelled) setStatuses([]);
      }
    };
    loadStatuses();
    return () => { cancelled = true; };
  }, [locale]);

  // Carga las reservas.
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
      setReservations(getResultsList(result));
    } catch (err) {
      setReservations([]);
      setError(resolveReservationErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Carga las reservas al montar.
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Estado y callbacks para el hook.
  return {
    state: { reservations, headquarters, statuses },
    ui: { isLoading: loading, error },
    actions: { reload: loadReservations },
    options: { hasReservations: reservations.length > 0 },
  };
}
