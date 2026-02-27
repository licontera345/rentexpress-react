import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const headquartersService = {
  getAllOpen() {
    return request({ url: api.headquarters.allOpen, method: 'GET' });
  },
  getById(id) {
    return request({ url: api.headquarters.byId(id), method: 'GET' });
  },
  create(data) {
    return request({ url: api.headquarters.create, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.headquarters.update(id), method: 'PUT', data });
  },
  delete(id) {
    return request({ url: api.headquarters.delete(id), method: 'DELETE' });
  },
};

export default headquartersService;
