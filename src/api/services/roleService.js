import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const roleService = {
  getAll() {
    return request({ url: api.roles.all, method: 'GET' });
  },
  getById(id) {
    return request({ url: api.roles.byId(id), method: 'GET' });
  },
};

export default roleService;
