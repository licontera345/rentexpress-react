import Config from "../../config/Config";

const SedeService = {
    getAll() {
        return fetch(Config.getFullUrl(Config.HEADQUARTERS.ALL))
            .then(response => response.ok ? response.json() : []);
    },

    getById(id) {
        return fetch(Config.getFullUrl(Config.HEADQUARTERS.BY_ID(id)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default SedeService;
