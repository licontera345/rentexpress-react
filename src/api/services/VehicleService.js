import Config from "../../config/Config";

const VehicleService = {
    findById(id) {
        return fetch(Config.getFullUrl(Config.VEHICLES.BY_ID(id)))
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    getById(id) {
        return VehicleService.findById(id);
    },

    search(criteria = {}) {
        const params = new URLSearchParams();
        
        if (criteria.currentHeadquartersId) {
            params.append('currentHeadquartersId', criteria.currentHeadquartersId);
        }
        if (criteria.returnHeadquartersId) {
            params.append('returnHeadquartersId', criteria.returnHeadquartersId);
        }
        if (criteria.activeStatus !== undefined) {
            params.append('activeStatus', criteria.activeStatus);
        }
        if (criteria.pageNumber) {
            params.append('pageNumber', criteria.pageNumber);
        }
        if (criteria.pageSize) {
            params.append('pageSize', criteria.pageSize);
        }

        const url = `${Config.getFullUrl(Config.VEHICLES.SEARCH)}${params.toString() ? '?' + params.toString() : ''}`;
        
        return fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    create(vehicle, token) {
        return fetch(Config.getFullUrl(Config.VEHICLES.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(vehicle)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, vehicle, token) {
        return fetch(Config.getFullUrl(Config.VEHICLES.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(vehicle)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.VEHICLES.DELETE(id)), {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => response.ok ? true : Promise.reject(response));
    }
};

export default VehicleService;
