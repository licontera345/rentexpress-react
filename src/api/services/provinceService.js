import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const provinceService = {
  getAll() {
    return request({ url: api.provinces.all, method: 'GET' });
  },
  getById(id) {
    return request({ url: api.provinces.byId(id), method: 'GET' });
  },
  create(data) {
    return request({ url: api.provinces.create, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.provinces.update(id), method: 'PUT', data });
  },
  delete(id) {
    return request({ url: api.provinces.delete(id), method: 'DELETE' });
  },
};

export default provinceService;
