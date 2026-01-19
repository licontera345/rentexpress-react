import Config from "../../config/Config";

const VehicleStatusService = {
    getAll(isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.VEHICLE_STATUSES.ALL(isoCode)))
            .then(response => response.ok ? response.json() : []);
    },

    getById(id, isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.VEHICLE_STATUSES.BY_ID(id, isoCode)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default VehicleStatusService;
