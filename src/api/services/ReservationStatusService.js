import Config from "../../config/apiConfig";
import { buildAuthHeaders, request } from "../axiosClient";

const ReservationStatusService = {
    getById(id, isoCode = 'es', token) {
        return request({
            url: Config.RESERVATION_STATUSES.BY_ID(id, isoCode),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    getAll(isoCode = 'es', token) {
        return request({
            url: Config.RESERVATION_STATUSES.ALL(isoCode),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    }
};

export default ReservationStatusService;
