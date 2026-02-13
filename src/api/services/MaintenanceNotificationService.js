import Config from "../../config/apiConfig";
import { buildParams, request } from "../axiosClient";

const MaintenanceNotificationService = {
  getInbox() {
    return request({
      url: Config.VEHICLES.SEARCH, 
      method: "GET",
      params: buildParams({
        vehicleStatusId: 2,
        pageSize: 50
      })
    });
  },

  /**
   * Notifica fin de mantenimiento.
   * Contrato API: POST /vehicles/finMantenimiento con { matricula, descripcion }.
   */
  notifyFinishMaintenance({ licensePlate, description } = {}) {
    return request({
      url: Config.VEHICLES.MAINTENANCE_INBOX,
      method: "POST",
      data: {
        matricula: licensePlate,
        descripcion: description ?? ''
      }
    });
  }
};

export default MaintenanceNotificationService;
