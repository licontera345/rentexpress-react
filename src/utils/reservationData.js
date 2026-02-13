import { MESSAGES } from '../constants';

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
