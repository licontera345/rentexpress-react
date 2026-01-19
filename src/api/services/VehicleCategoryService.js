import Config from "../../config/Config";

const VehicleCategoryService = {
    getAll(isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.VEHICLE_CATEGORIES.ALL(isoCode)))
            .then(response => response.ok ? response.json() : []);
    },

    getById(id, isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.VEHICLE_CATEGORIES.BY_ID(id, isoCode)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default VehicleCategoryService;
