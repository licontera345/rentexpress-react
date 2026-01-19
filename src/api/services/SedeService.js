import Config from "../../config/Config";

const SedeService = {
    getAll() {
        return fetch(Config.getFullUrl(Config.HEADQUARTERS.ALL))
            .then(response => response.ok ? response.json() : []);
    },

    getById(id, token) {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return fetch(Config.getFullUrl(Config.HEADQUARTERS.BY_ID(id)), { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    create(headquarters, token) {
        return fetch(Config.getFullUrl(Config.HEADQUARTERS.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(headquarters)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, headquarters, token) {
        return fetch(Config.getFullUrl(Config.HEADQUARTERS.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(headquarters)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.HEADQUARTERS.DELETE(id)), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? true : Promise.reject(response));
    }
};

export default SedeService;
