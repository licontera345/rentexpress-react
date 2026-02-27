import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const vehicleStatusService = {
  getAll(isoCode) {
    return request({ url: api.vehicleStatuses.all(isoCode), method: 'GET' });
  },
  getById(id, isoCode) {
    return request({ url: api.vehicleStatuses.byId(id, isoCode), method: 'GET' });
  },
};

export default vehicleStatusService;
