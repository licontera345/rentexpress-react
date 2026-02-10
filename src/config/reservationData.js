import HeadquartersService from '../api/services/SedeService';
import ReservationStatusService from '../api/services/ReservationStatusService';
import VehicleService from '../api/services/VehicleService';
import { MESSAGES } from '../constants';

// Crea un mapa id -> entidad, evitando peticiones duplicadas.
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

// Enriquecer reservas con sede, vehículo y estado si vienen solo con ids.
export const enrichReservations = async (reservations, { canFetchStatuses = true, isoCode = 'es' } = {}) => {
  if (!reservations.length) return reservations;

  const headquartersIds = reservations
    .flatMap((reservation) => [reservation?.pickupHeadquartersId, reservation?.returnHeadquartersId])
    .filter(Boolean);
  const vehicleIds = reservations
    .filter((reservation) => !reservation?.vehicle && reservation?.vehicleId)
    .map((reservation) => reservation.vehicleId);
  const statusIds = canFetchStatuses
    ? reservations
      .filter((reservation) => reservation?.reservationStatusId)
      .map((reservation) => reservation.reservationStatusId)
    : [];

  const [headquartersMap, vehicleMap, statusMap] = await Promise.all([
    buildLookupMap(headquartersIds, (id) => HeadquartersService.getById(id)),
    buildLookupMap(vehicleIds, (id) => VehicleService.findById(id)),
    canFetchStatuses
      ? buildLookupMap(statusIds, (id) => ReservationStatusService.getById(id, isoCode))
      : Promise.resolve(new Map())
  ]);

  return reservations.map((reservation) => {
    const nextReservation = { ...reservation };
    if (!nextReservation.pickupHeadquarters && headquartersMap.has(nextReservation.pickupHeadquartersId)) {
      nextReservation.pickupHeadquarters = [headquartersMap.get(nextReservation.pickupHeadquartersId)];
    }
    if (!nextReservation.returnHeadquarters && headquartersMap.has(nextReservation.returnHeadquartersId)) {
      nextReservation.returnHeadquarters = [headquartersMap.get(nextReservation.returnHeadquartersId)];
    }
    if (!nextReservation.vehicle && vehicleMap.has(nextReservation.vehicleId)) {
      nextReservation.vehicle = [vehicleMap.get(nextReservation.vehicleId)];
    }
    if (statusMap.has(nextReservation.reservationStatusId)) {
      nextReservation.reservationStatus = statusMap.get(nextReservation.reservationStatusId);
    }
    return nextReservation;
  });
};

// Traduce un error HTTP en un mensaje de UI coherente.
export const resolveReservationErrorMessage = (err) => {
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
