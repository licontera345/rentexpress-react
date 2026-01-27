import Config from "../../config/apiConfig";
import { buildAuthHeaders, buildParams, request } from "../axiosClient";

const ReservationService = {
    create(reservation, token) {
        return request({
            url: Config.RESERVATIONS.CREATE,
            method: "POST",
            data: reservation,
            headers: buildAuthHeaders(token)
        });
    },

    search(criteria = {}, token) {
        return request({
            url: Config.RESERVATIONS.SEARCH,
            method: "GET",
            params: buildParams({
                reservationId: criteria.reservationId,
                vehicleId: criteria.vehicleId,
                userId: criteria.userId,
                employeeId: criteria.employeeId,
                reservationStatusId: criteria.reservationStatusId,
                pickupHeadquartersId: criteria.pickupHeadquartersId,
                returnHeadquartersId: criteria.returnHeadquartersId,
                startDateFrom: criteria.startDateFrom,
                startDateTo: criteria.startDateTo,
                endDateFrom: criteria.endDateFrom,
                endDateTo: criteria.endDateTo,
                createdAtFrom: criteria.createdAtFrom,
                createdAtTo: criteria.createdAtTo,
                updatedAtFrom: criteria.updatedAtFrom,
                updatedAtTo: criteria.updatedAtTo,
                pageNumber: criteria.pageNumber,
                pageSize: criteria.pageSize
            }),
            headers: buildAuthHeaders(token)
        });
    }
};

export default ReservationService;
