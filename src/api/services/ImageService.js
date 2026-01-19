import Config from '../../config/Config';
import AuthService from './AuthService';

const ImageService = {
  upload: async (file, vehicleId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (vehicleId) {
      formData.append('vehicleId', vehicleId);
    }

    return fetch(Config.getFullUrl('/images/upload'), {
      method: 'POST',
      headers: AuthService.getAuthHeader(),
      body: formData
    }).then(response => response.ok ? response.json() : Promise.reject(response));
  },

  delete: async (imageId) => {
    return fetch(Config.getFullUrl(`/images/${imageId}`), {
      method: 'DELETE',
      headers: AuthService.getAuthHeader()
    }).then(response => response.ok ? response.json() : Promise.reject(response));
  },

  getById: async (imageId) => {
    return fetch(Config.getFullUrl(`/images/${imageId}`), {
      headers: AuthService.getAuthHeader()
    }).then(response => response.ok ? response.json() : Promise.reject(response));
  },

  getByVehicleId: async (vehicleId) => {
    return fetch(Config.getFullUrl(`/images/vehicle/${vehicleId}`), {
      headers: AuthService.getAuthHeader()
    }).then(response => response.ok ? response.json() : Promise.reject(response));
  }
};

export default ImageService;