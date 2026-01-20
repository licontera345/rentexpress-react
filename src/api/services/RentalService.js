import Config from "../../config/Config";
import { buildAuthHeaders, buildParams, request } from "../axiosClient";

const RentalService = {
    findById(id, token) {
        return request({
            url: Config.RENTALS.BY_ID(id),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    search(criteria = {}, token) {
        return request({
            url: Config.RENTALS.SEARCH,
            method: "GET",
            params: buildParams({
                rentalId: criteria.rentalId,
                rentalStatusId: criteria.rentalStatusId,
                pickupHeadquartersId: criteria.pickupHeadquartersId,
                returnHeadquartersId: criteria.returnHeadquartersId,
                startDateEffectiveFrom: criteria.startDateEffectiveFrom,
                startDateEffectiveTo: criteria.startDateEffectiveTo,
                endDateEffectiveFrom: criteria.endDateEffectiveFrom,
                endDateEffectiveTo: criteria.endDateEffectiveTo,
                totalCostMin: criteria.totalCostMin,
                totalCostMax: criteria.totalCostMax,
                startDateEffective: criteria.startDateEffective,
                endDateEffective: criteria.endDateEffective,
                initialKm: criteria.initialKm,
                finalKm: criteria.finalKm,
                totalCost: criteria.totalCost,
                pageNumber: criteria.pageNumber,
                pageSize: criteria.pageSize
            }),
            headers: buildAuthHeaders(token)
        });
    },

    create(rental, token) {
        return request({
            url: Config.RENTALS.CREATE,
            method: "POST",
            data: rental,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, rental, token) {
        return request({
            url: Config.RENTALS.UPDATE(id),
            method: "PUT",
            data: rental,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.RENTALS.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    },

    existsByReservation(reservationId, token) {
        return request({
            url: Config.RENTALS.EXISTS_BY_RESERVATION(reservationId),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    createFromReservation(payload, token) {
        return request({
            url: Config.RENTALS.FROM_RESERVATION,
            method: "POST",
            data: payload,
            headers: buildAuthHeaders(token)
        });
    },

    autoConvert(token) {
        return request({
            url: Config.RENTALS.AUTO_CONVERT,
            method: "POST",
            headers: buildAuthHeaders(token)
        });
    }
};

export default RentalService;
