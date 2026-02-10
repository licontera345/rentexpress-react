import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const ProfileImageService = {
  listUsers(userId) {
    return request({
      url: Config.IMAGES.USER_BY_ID(userId),
      method: 'GET'
    });
  },

  uploadUser(userId, imagePayload) {
    return request({
      url: Config.IMAGES.USER_BY_ID(userId),
      method: 'POST',
      data: imagePayload
    });
  },

  listEmployees(employeeId) {
    return request({
      url: Config.IMAGES.EMPLOYEE_BY_ID(employeeId),
      method: 'GET'
    });
  },

  uploadEmployee(employeeId, imagePayload) {
    return request({
      url: Config.IMAGES.EMPLOYEE_BY_ID(employeeId),
      method: 'POST',
      data: imagePayload
    });
  },

  remove(imageId) {
    return request({
      url: Config.IMAGES.BY_ID(imageId),
      method: 'DELETE'
    });
  }
};

export default ProfileImageService;
