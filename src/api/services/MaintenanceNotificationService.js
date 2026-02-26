import Config from "../../config/apiConfig";
import { VEHICLE_STATUS } from "../../constants";
import { buildParams, request } from "../axiosClient";

const MaintenanceNotificationService = {
  getInbox() {
    return request({
      url: Config.VEHICLES.SEARCH, 
      method: "GET",
      params: buildParams({
        vehicleStatusId: VEHICLE_STATUS.MAINTENANCE_ID,
        pageSize: 50
      })
    });
  },

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
