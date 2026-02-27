import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const rentalStatusService = {
  getAll(isoCode) {
    return request({ url: api.rentalStatuses.all(isoCode), method: 'GET' });
  },
  getById(id, isoCode) {
    return request({ url: api.rentalStatuses.byId(id, isoCode), method: 'GET' });
  },
};

export default rentalStatusService;
