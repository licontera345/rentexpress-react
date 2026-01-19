import Config from "../../config/Config";

const RoleService = {
    getAll() {
        return fetch(Config.getFullUrl(Config.ROLES.ALL))
            .then(response => response.ok ? response.json() : []);
    },

    getById(id) {
        return fetch(Config.getFullUrl(Config.ROLES.BY_ID(id)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default RoleService;
