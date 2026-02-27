import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const vehicleCategoryService = {
  getAll(isoCode) {
    return request({ url: api.vehicleCategories.all(isoCode), method: 'GET' });
  },
  getById(id, isoCode) {
    return request({ url: api.vehicleCategories.byId(id, isoCode), method: 'GET' });
  },
};

export default vehicleCategoryService;
