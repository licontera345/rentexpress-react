import api from '../../config/api.js';
import { request, buildParams } from '../axiosClient.js';

/**
 * Lista vehículos en mantenimiento (vehicleStatusId = 2 según API).
 * params.vehicleStatusId y params.pageSize opcionales.
 */
export const maintenanceService = {
  getInbox(params = {}) {
    return request({
      url: api.vehicles.search,
      method: 'GET',
      params: buildParams({
        vehicleStatusId: params.vehicleStatusId,
        pageSize: params.pageSize ?? 50,
      }),
    });
  },
  notifyFinish(data) {
    return request({
      url: api.vehicles.maintenanceInbox,
      method: 'POST',
      data: {
        matricula: data?.licensePlate ?? data?.matricula,
        descripcion: data?.description ?? data?.descripcion ?? '',
      },
    });
  },
};

export default maintenanceService;
