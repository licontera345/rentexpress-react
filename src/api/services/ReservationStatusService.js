import Config from "../../config/Config";

const ReservationStatusService = {
    getAll(isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.RESERVATION_STATUSES.ALL(isoCode)))
            .then(response => response.ok ? response.json() : []);
    },

    getById(id, isoCode = 'es') {
        return fetch(Config.getFullUrl(Config.RESERVATION_STATUSES.BY_ID(id, isoCode)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default ReservationStatusService;
