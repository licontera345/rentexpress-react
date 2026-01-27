import Config from "../../config/apiConfig";
import { buildAuthHeaders, request } from "../axiosClient";

const ReservationService = {
    create(reservation, token) {
        return request({
            url: Config.RESERVATIONS.CREATE,
            method: "POST",
            data: reservation,
            headers: buildAuthHeaders(token)
        });
    }
};

export default ReservationService;
