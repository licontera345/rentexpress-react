import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const addressService = {
  getByIdOpen(id) {
    return request({ url: api.addresses.byIdOpen(id), method: 'GET' });
  },
  createOpen(data) {
    return request({ url: api.addresses.createOpen, method: 'POST', data });
  },
  update(id, data) {
    return request({
      url: api.addresses.update(id),
      method: 'PUT',
      data: { ...data, id },
    });
  },
  delete(id) {
    return request({ url: api.addresses.delete(id), method: 'DELETE' });
  },
};

export default addressService;
