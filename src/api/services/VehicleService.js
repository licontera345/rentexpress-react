import Config from "../../config/apiConfig";
import { buildParams, request } from "../axiosClient";

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
                pageSize: criteria.pageSize,
                availableFrom: criteria.availableFrom,
                availableTo: criteria.availableTo
            })
        });
    },

    create(vehicle) {
        return request({
            url: Config.VEHICLES.CREATE,
            method: "POST",
            data: vehicle
        });
    },

    update(id, vehicle) {
        return request({
            url: Config.VEHICLES.UPDATE(id),
            method: "PUT",
            data: vehicle
        });
    },

    async delete(id) {
        await request({
            url: Config.VEHICLES.DELETE(id),
            method: "DELETE"
        });
        return true;
    }
};

export default VehicleService;
