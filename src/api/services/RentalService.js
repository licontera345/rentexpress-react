import Config from "../../config/Config";

const RentalService = {
    findById(id, token) {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return fetch(Config.getFullUrl(Config.RENTALS.BY_ID(id)), { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    search(criteria = {}, token) {
        const params = new URLSearchParams();

        const addParam = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        };

        addParam('rentalId', criteria.rentalId);
        addParam('rentalStatusId', criteria.rentalStatusId);
        addParam('pickupHeadquartersId', criteria.pickupHeadquartersId);
        addParam('returnHeadquartersId', criteria.returnHeadquartersId);
        addParam('startDateEffectiveFrom', criteria.startDateEffectiveFrom);
        addParam('startDateEffectiveTo', criteria.startDateEffectiveTo);
        addParam('endDateEffectiveFrom', criteria.endDateEffectiveFrom);
        addParam('endDateEffectiveTo', criteria.endDateEffectiveTo);
        addParam('totalCostMin', criteria.totalCostMin);
        addParam('totalCostMax', criteria.totalCostMax);
        addParam('startDateEffective', criteria.startDateEffective);
        addParam('endDateEffective', criteria.endDateEffective);
        addParam('initialKm', criteria.initialKm);
        addParam('finalKm', criteria.finalKm);
        addParam('totalCost', criteria.totalCost);
        addParam('pageNumber', criteria.pageNumber);
        addParam('pageSize', criteria.pageSize);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = `${Config.getFullUrl(Config.RENTALS.SEARCH)}${params.toString() ? `?${params.toString()}` : ''}`;

        return fetch(url, { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    create(rental, token) {
        return fetch(Config.getFullUrl(Config.RENTALS.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(rental)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, rental, token) {
        return fetch(Config.getFullUrl(Config.RENTALS.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(rental)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.RENTALS.DELETE(id)), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? true : Promise.reject(response));
    },

    existsByReservation(reservationId, token) {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return fetch(Config.getFullUrl(Config.RENTALS.EXISTS_BY_RESERVATION(reservationId)), { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    createFromReservation(payload, token) {
        return fetch(Config.getFullUrl(Config.RENTALS.FROM_RESERVATION), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    autoConvert(token) {
        return fetch(Config.getFullUrl(Config.RENTALS.AUTO_CONVERT), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default RentalService;
