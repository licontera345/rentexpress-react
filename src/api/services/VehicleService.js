import Config from "../../config/apiConfig";
import { buildAuthHeaders, buildParams, request } from "../axiosClient";

const VehicleService = {
    findById(id) {
        return request({
            url: Config.VEHICLES.BY_ID(id),
            method: "GET"
        });
    },

    search(criteria = {}) {
        return request({
            url: Config.VEHICLES.SEARCH,
            method: "GET",
            params: buildParams({
                vehicleId: criteria.vehicleId,
                vehicleStatusId: criteria.vehicleStatusId,
                categoryId: criteria.categoryId,
                currentHeadquartersId: criteria.currentHeadquartersId,
                brand: criteria.brand,
                model: criteria.model,
                licensePlate: criteria.licensePlate,
                vinNumber: criteria.vinNumber,
                manufactureYearFrom: criteria.manufactureYearFrom,
                manufactureYearTo: criteria.manufactureYearTo,
                dailyPriceMin: criteria.dailyPriceMin,
                dailyPriceMax: criteria.dailyPriceMax,
                currentMileageMin: criteria.currentMileageMin,
                currentMileageMax: criteria.currentMileageMax,
                activeStatus: criteria.activeStatus,
                pageNumber: criteria.pageNumber,
                pageSize: criteria.pageSize
            })
        });
    },

    create(vehicle, token) {
        return request({
            url: Config.VEHICLES.CREATE,
            method: "POST",
            data: vehicle,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, vehicle, token) {
        return request({
            url: Config.VEHICLES.UPDATE(id),
            method: "PUT",
            data: vehicle,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.VEHICLES.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    }
};

export default VehicleService;
