import Config from "../../config/Config";

const ProvinceService = {
    findAll() {
        return fetch(Config.getFullUrl(Config.PROVINCES.ALL))
            .then(response => response.ok ? response.json() : []);
    },

    findById(id) {
        return fetch(Config.getFullUrl(Config.PROVINCES.BY_ID(id)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    create(province, token) {
        return fetch(Config.getFullUrl(Config.PROVINCES.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(province)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, province, token) {
        return fetch(Config.getFullUrl(Config.PROVINCES.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(province)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.PROVINCES.DELETE(id)), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? true : Promise.reject(response));
    }
};

export default ProvinceService;
