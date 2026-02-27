import Config from "../../config/apiConfig";
import { buildParams, request } from "../axiosClient";

const ReservationService = {
    findById(id) {
        return request({
            url: Config.RESERVATIONS.BY_ID(id),
            method: "GET"
        });
    },

    create(reservation) {
        return request({
            url: Config.RESERVATIONS.CREATE,
            method: "POST",
            data: reservation
        });
    },

    update(id, reservation) {
        return request({
            url: Config.RESERVATIONS.UPDATE(id),
            method: "PUT",
            data: reservation
        });
    },

    getEstimate(dailyPrice, startDateIso, endDateIso) {
        return request({
            url: Config.RESERVATIONS.ESTIMATE,
            method: "GET",
            params: { dailyPrice, startDate: startDateIso, endDate: endDateIso }
        });
    },

    search(criteria = {}) {
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
            })
        });
    },

    async delete(id) {
        await request({
            url: Config.RESERVATIONS.DELETE(id),
            method: "DELETE"
        });
        return true;
    },

    generatePickupCode(id) {
        return request({
            url: Config.RESERVATIONS.GENERATE_PICKUP_CODE(id),
            method: "POST"
        });
    },

    verifyPickupCode(code) {
        return request({
            url: Config.RESERVATIONS.VERIFY_PICKUP_CODE(code),
            method: "GET"
        });
    }
};

export default ReservationService;
