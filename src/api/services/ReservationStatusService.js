import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const ReservationStatusService = {
    getById(id, isoCode = 'es') {
        return request({
            url: Config.RESERVATION_STATUSES.BY_ID(id, isoCode),
            method: "GET"
        });
    },

    getAll(isoCode = 'es') {
        return request({
            url: Config.RESERVATION_STATUSES.ALL(isoCode),
            method: "GET"
        });
    }
};

export default ReservationStatusService;
