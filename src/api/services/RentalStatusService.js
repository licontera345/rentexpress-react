import Config from "../../config/Config";
import { request } from "../axiosClient";

const RentalStatusService = {
    async getAll(isoCode = 'es') {
        try {
            return await request({
                url: Config.RENTAL_STATUSES.ALL(isoCode),
                method: "GET"
            });
        } catch (error) {
            return [];
        }
    },

    getById(id, isoCode = 'es') {
        return request({
            url: Config.RENTAL_STATUSES.BY_ID(id, isoCode),
            method: "GET"
        });
    }
};

export default RentalStatusService;
