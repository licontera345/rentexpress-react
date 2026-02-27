import api from '../../config/api.js';
import { request } from '../axiosClient.js';

export const imageService = {
  listByUser(userId) {
    return request({ url: api.images.user(userId), method: 'GET' });
  },
  uploadUser(userId, data) {
    return request({ url: api.images.user(userId), method: 'POST', data });
  },
  listByEmployee(employeeId) {
    return request({ url: api.images.employee(employeeId), method: 'GET' });
  },
  uploadEmployee(employeeId, data) {
    return request({ url: api.images.employee(employeeId), method: 'POST', data });
  },
  listByVehicle(vehicleId) {
    return request({ url: api.images.vehicle(vehicleId), method: 'GET' });
  },
  uploadVehicle(vehicleId, data) {
    return request({ url: api.images.vehicle(vehicleId), method: 'POST', data });
  },
  delete(imageId) {
    return request({ url: api.images.byId(imageId), method: 'DELETE' });
  },
  getCloudinarySignature() {
    return request({ url: api.cloudinary.signature, method: 'GET' });
  },
};

export default imageService;
