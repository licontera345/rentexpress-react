import Config from "../../config/Config";

const RentalStatusService = {
    getAll(isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.RENTAL_STATUSES.ALL(isoCode)))
            .then(response => response.ok ? response.json() : []);
    },

    getById(id, isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.RENTAL_STATUSES.BY_ID(id, isoCode)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default RentalStatusService;
