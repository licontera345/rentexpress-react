import Config from '../../config/Config';
import { request } from '../axiosClient';

const ImageService = {
  upload: async (file, vehicleId) => {
    if (!vehicleId) {
      return Promise.reject(new Error('ID de vehículo requerido'));
    }

    const formData = new FormData();
    formData.append('file', file);

    return request({
      url: `/open/file/vehicle/${vehicleId}`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getVehicleImageUrl: (vehicleId, imageName) => {
    return Config.getFullUrl(`/open/file/vehicle/${vehicleId}/${imageName}`);
  },

  listVehicleImages: (vehicleId) => {
    return request({
      url: `/open/file/vehicle/${vehicleId}`,
      method: 'GET'
    });
  },

  deleteVehicleImage: (vehicleId, imageName) => {
    return request({
      url: `/open/file/vehicle/${vehicleId}/${imageName}`,
      method: 'DELETE'
    });
  }
};

export default ImageService;
