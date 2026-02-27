import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const reservationStatusService = {
  getAll(isoCode) {
    return request({ url: api.reservationStatuses.all(isoCode), method: 'GET' });
  },
  getById(id, isoCode) {
    return request({ url: api.reservationStatuses.byId(id, isoCode), method: 'GET' });
  },
};

export default reservationStatusService;
