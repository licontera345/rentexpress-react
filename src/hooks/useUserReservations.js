import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../api/services/ReservationService';
import HeadquartersService from '../api/services/SedeService';
import ReservationStatusService from '../api/services/ReservationStatusService';
import VehicleService from '../api/services/VehicleService';
import { useAuth } from './useAuth';
import { MESSAGES } from '../constants/messages';

const resolveUserId = (user) => user?.userId || user?.id || null;

const buildLookupMap = async (ids, fetcher) => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return new Map();
  }

  const entries = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const data = await fetcher(id);
        return [id, data];
      } catch {
        return [id, null];
      }
    })
  );

  return new Map(entries.filter(([, value]) => Boolean(value)));
};

const normalizeReservations = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
};

const enrichReservations = async (reservations, { token, canFetchStatuses = true } = {}) => {
  if (!reservations.length) return reservations;

  const headquartersIds = reservations
    .flatMap((reservation) => [reservation?.pickupHeadquartersId, reservation?.returnHeadquartersId])
    .filter(Boolean);
  const vehicleIds = reservations
    .filter((reservation) => !reservation?.vehicle && reservation?.vehicleId)
    .map((reservation) => reservation.vehicleId);
  const statusIds = canFetchStatuses
    ? reservations
      .filter((reservation) => !reservation?.reservationStatus && reservation?.reservationStatusId)
      .map((reservation) => reservation.reservationStatusId)
    : [];

  const [headquartersMap, vehicleMap, statusMap] = await Promise.all([
    buildLookupMap(headquartersIds, (id) => HeadquartersService.getById(id, token)),
    buildLookupMap(vehicleIds, (id) => VehicleService.getById(id)),
    canFetchStatuses
      ? buildLookupMap(statusIds, (id) => ReservationStatusService.getById(id, 'es', token))
      : Promise.resolve(new Map())
  ]);

  return reservations.map((reservation) => {
    const nextReservation = { ...reservation };
    if (!nextReservation.pickupHeadquarters && headquartersMap.has(nextReservation.pickupHeadquartersId)) {
      nextReservation.pickupHeadquarters = headquartersMap.get(nextReservation.pickupHeadquartersId);
    }
    if (!nextReservation.returnHeadquarters && headquartersMap.has(nextReservation.returnHeadquartersId)) {
      nextReservation.returnHeadquarters = headquartersMap.get(nextReservation.returnHeadquartersId);
    }
    if (!nextReservation.vehicle && vehicleMap.has(nextReservation.vehicleId)) {
      nextReservation.vehicle = vehicleMap.get(nextReservation.vehicleId);
    }
    if (!nextReservation.reservationStatus && statusMap.has(nextReservation.reservationStatusId)) {
      nextReservation.reservationStatus = statusMap.get(nextReservation.reservationStatusId);
    }
    return nextReservation;
  });
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
      const normalizedReservations = normalizeReservations(result);
      const hydratedReservations = await enrichReservations(normalizedReservations, {
        token,
        canFetchStatuses: true
      });
      setReservations(hydratedReservations);
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
