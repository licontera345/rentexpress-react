import Config from "../../config/Config";

const AddressService = {
    findById(id, token) {
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        return fetch(Config.getFullUrl(Config.ADDRESSES.BY_ID(id)), { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    create(address, token) {
        return fetch(Config.getFullUrl(Config.ADDRESSES.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(address)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, address, token) {
        return fetch(Config.getFullUrl(Config.ADDRESSES.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(address)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.ADDRESSES.DELETE(id)), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? true : Promise.reject(response));
    }
};

export default AddressService;
