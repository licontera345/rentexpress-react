import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const VehicleStatusService = {
    getAll(isoCode = 'es') {
        return request({
            url: Config.VEHICLE_STATUSES.ALL(isoCode),
            method: "GET"
        });
    },

    getById(id, isoCode = 'es') {
        return request({
            url: Config.VEHICLE_STATUSES.BY_ID(id, isoCode),
            method: "GET"
        });
    }
};

export default VehicleStatusService;
