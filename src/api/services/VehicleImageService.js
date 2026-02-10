import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const VehicleImageService = {
  list(vehicleId) {
    return request({
      url: Config.IMAGES.VEHICLE_BY_ID(vehicleId),
      method: 'GET'
    });
  },

  upload(vehicleId, imagePayload) {
    return request({
      url: Config.IMAGES.VEHICLE_BY_ID(vehicleId),
      method: 'POST',
      data: imagePayload
    });
  },

  remove(imageId) {
    return request({
      url: Config.IMAGES.BY_ID(imageId),
      method: 'DELETE'
    });
  },

  getCloudinarySignature() {
    return request({
      url: Config.CLOUDINARY.SIGNATURE,
      method: 'GET'
    });
  }
};

export default VehicleImageService;
