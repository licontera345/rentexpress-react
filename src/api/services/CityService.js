import Config from "../../config/Config";

const CityService = {
    findAll() {
        return fetch(Config.getFullUrl(Config.CITIES.ALL))
            .then(response => response.ok ? response.json() : []);
    },

    findById(id, token) {
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        return fetch(Config.getFullUrl(Config.CITIES.BY_ID(id)), { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    findByProvinceId(provinceId) {
        return fetch(Config.getFullUrl(Config.CITIES.BY_PROVINCE(provinceId)))
            .then(response => response.ok ? response.json() : []);
    },

    create(city, token) {
        return fetch(Config.getFullUrl(Config.CITIES.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(city)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, city, token) {
        return fetch(Config.getFullUrl(Config.CITIES.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(city)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.CITIES.DELETE(id)), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? true : Promise.reject(response));
    }
};

export default CityService;
