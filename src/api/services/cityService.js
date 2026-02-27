import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const cityService = {
  getAllOpen() {
    return request({ url: api.cities.allOpen, method: 'GET' });
  },
  getById(id) {
    return request({ url: api.cities.byId(id), method: 'GET' });
  },
  getByProvince(provinceId) {
    return request({ url: api.cities.byProvince(provinceId), method: 'GET' });
  },
  create(data) {
    return request({ url: api.cities.create, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.cities.update(id), method: 'PUT', data });
  },
  delete(id) {
    return request({ url: api.cities.delete(id), method: 'DELETE' });
  },
};

export default cityService;
