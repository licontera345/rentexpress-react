import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const VehicleCategoryService = {
    async getAll(isoCode = 'es') {
        try {
            return await request({
                url: Config.VEHICLE_CATEGORIES.ALL(isoCode),
                method: "GET"
            });
        } catch {
            return [];
        }
    },

    getById(id, isoCode = 'es') {
        return request({
            url: Config.VEHICLE_CATEGORIES.BY_ID(id, isoCode),
            method: "GET"
        });
    }
};

export default VehicleCategoryService;
