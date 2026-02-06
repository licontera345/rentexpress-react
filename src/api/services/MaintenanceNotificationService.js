import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const MaintenanceNotificationService = {
  getInbox() {
    return request({
      url: Config.VEHICLES.MAINTENANCE_INBOX,
      method: "GET"
    });
  }
};

export default MaintenanceNotificationService;
