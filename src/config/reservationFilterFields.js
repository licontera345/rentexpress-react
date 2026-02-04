import { MESSAGES } from '../constants';
import { getHeadquartersOptionLabel } from './headquartersLabels';

// Convierte estados en opciones para el select.
const buildStatusOptions = (statuses) => (
  statuses.map((status) => ({
    value: status.reservationStatusId ?? status.id,
    label: status.statusName ?? status.name
  }))
);

// Convierte sedes en opciones con etiqueta legible.
const buildHeadquartersOptions = (headquarters) => (
  headquarters.map((hq) => ({
    value: hq.headquartersId ?? hq.id,
    label: getHeadquartersOptionLabel(hq)
  }))
);

// Define los campos del filtro de reservas para la UI.
export const buildReservationFilterFields = ({
  statuses = [],
  headquarters = []
} = {}) => [
  {
    name: 'reservationId',
    label: MESSAGES.RESERVATION_ID,
    type: 'number',
    placeholder: MESSAGES.RESERVATION_ID
  },
  {
    name: 'vehicleId',
    label: MESSAGES.VEHICLE_ID,
    type: 'number',
    placeholder: MESSAGES.VEHICLE_ID
  },
  {
    name: 'userId',
    label: MESSAGES.CUSTOMER_ID,
    type: 'number',
    placeholder: MESSAGES.CUSTOMER_ID_PLACEHOLDER
  },
  {
    name: 'reservationStatusId',
    label: MESSAGES.RESERVATION_STATUS_LABEL,
    type: 'select',
    placeholder: MESSAGES.ALL_STATUSES,
    options: buildStatusOptions(statuses)
  },
  {
    name: 'pickupHeadquartersId',
    label: MESSAGES.PICKUP_LOCATION,
    type: 'select',
    placeholder: MESSAGES.SELECT_LOCATION,
    options: buildHeadquartersOptions(headquarters)
  },
  {
    name: 'returnHeadquartersId',
    label: MESSAGES.RETURN_LOCATION,
    type: 'select',
    placeholder: MESSAGES.SELECT_LOCATION,
    options: buildHeadquartersOptions(headquarters)
  },
  {
    name: 'startDateFrom',
    label: `${MESSAGES.PICKUP_DATE} ${MESSAGES.FROM}`,
    type: 'date',
    placeholder: MESSAGES.DATE_FROM
  },
  {
    name: 'startDateTo',
    label: `${MESSAGES.PICKUP_DATE} ${MESSAGES.TO}`,
    type: 'date',
    placeholder: MESSAGES.DATE_TO
  },
  {
    name: 'endDateFrom',
    label: `${MESSAGES.RETURN_DATE} ${MESSAGES.FROM}`,
    type: 'date',
    placeholder: MESSAGES.DATE_FROM
  },
  {
    name: 'endDateTo',
    label: `${MESSAGES.RETURN_DATE} ${MESSAGES.TO}`,
    type: 'date',
    placeholder: MESSAGES.DATE_TO
  }
];
