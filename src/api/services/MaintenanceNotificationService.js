import { request } from "../axiosClient";

const MaintenanceNotificationService = {
  getInbox() {
    return request({
      url: Config.VEHICLES.SEARCH, 
      method: "GET",
      params: { 
        vehicleStatusId: 2,
        pageSize: 50       
      }
    });
  }
};

export default MaintenanceNotificationService;