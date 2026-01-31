import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const VehicleCategoryService = {
    getAll(isoCode = 'es') {
        return request({
            url: Config.VEHICLE_CATEGORIES.ALL(isoCode),
            method: "GET"
        });
    },

    getById(id, isoCode = 'es') {
        return request({
            url: Config.VEHICLE_CATEGORIES.BY_ID(id, isoCode),
            method: "GET"
        });
    }
};

export default VehicleCategoryService;
