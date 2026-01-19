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

        const addParam = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        };

        addParam('vehicleId', criteria.vehicleId);
        addParam('vehicleStatusId', criteria.vehicleStatusId);
        addParam('categoryId', criteria.categoryId);
        addParam('currentHeadquartersId', criteria.currentHeadquartersId);
        addParam('brand', criteria.brand);
        addParam('model', criteria.model);
        addParam('licensePlate', criteria.licensePlate);
        addParam('vinNumber', criteria.vinNumber);
        addParam('manufactureYearFrom', criteria.manufactureYearFrom);
        addParam('manufactureYearTo', criteria.manufactureYearTo);
        addParam('dailyPriceMin', criteria.dailyPriceMin);
        addParam('dailyPriceMax', criteria.dailyPriceMax);
        addParam('currentMileageMin', criteria.currentMileageMin);
        addParam('currentMileageMax', criteria.currentMileageMax);
        addParam('activeStatus', criteria.activeStatus);
        addParam('pageNumber', criteria.pageNumber);
        addParam('pageSize', criteria.pageSize);

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
