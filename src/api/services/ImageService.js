import Config from '../../config/Config';

const ImageService = {
  upload: async (file, vehicleId) => {
    if (!vehicleId) {
      return Promise.reject(new Error('ID de vehículo requerido'));
    }

    const formData = new FormData();
    formData.append('file', file);

    return fetch(Config.getFullUrl(`/open/file/vehicle/${vehicleId}`), {
      method: 'POST',
      body: formData
    }).then(response => response.ok ? response.json() : Promise.reject(response));
  },

  getVehicleImageUrl: (vehicleId, imageName) => {
    return Config.getFullUrl(`/open/file/vehicle/${vehicleId}/${imageName}`);
  },

  listVehicleImages: async (vehicleId) => {
    return fetch(Config.getFullUrl(`/open/file/vehicle/${vehicleId}`))
      .then(response => response.ok ? response.json() : Promise.reject(response));
  },

  deleteVehicleImage: async (vehicleId, imageName) => {
    return fetch(Config.getFullUrl(`/open/file/vehicle/${vehicleId}/${imageName}`), {
      method: 'DELETE'
    }).then(response => response.ok ? response.json() : Promise.reject(response));
  }
};

export default ImageService;
