import Config from "../../config/Config";

const buildAuthHeader = (token) => {
    if (!token || typeof token !== 'string') {
        return {};
    }

    const trimmedToken = token.trim();
    if (!trimmedToken || trimmedToken === 'null' || trimmedToken === 'undefined') {
        return {};
    }

    const formattedToken = trimmedToken.toLowerCase().startsWith('bearer ')
        ? trimmedToken
        : `Bearer ${trimmedToken}`;
    return { Authorization: formattedToken };
};

const parseBody = async (response) => {
    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
};

const handleResponse = async (response) => {
    const data = await parseBody(response);
    if (!response.ok) {
        const error = new Error(data?.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.payload = data;
        throw error;
    }
    return data;
};

const ReservationService = {
    findById(id, token) {
        const headers = buildAuthHeader(token);
        return fetch(Config.getFullUrl(Config.RESERVATIONS.BY_ID(id)), { headers })
            .then(handleResponse);
    },

    search(criteria = {}, token) {
        const params = new URLSearchParams();

        const addParam = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        };

        addParam('reservationId', criteria.reservationId);
        addParam('vehicleId', criteria.vehicleId);
        addParam('userId', criteria.userId);
        addParam('employeeId', criteria.employeeId);
        addParam('reservationStatusId', criteria.reservationStatusId);
        addParam('pickupHeadquartersId', criteria.pickupHeadquartersId);
        addParam('returnHeadquartersId', criteria.returnHeadquartersId);
        addParam('startDateFrom', criteria.startDateFrom);
        addParam('startDateTo', criteria.startDateTo);
        addParam('endDateFrom', criteria.endDateFrom);
        addParam('endDateTo', criteria.endDateTo);
        addParam('createdAtFrom', criteria.createdAtFrom);
        addParam('createdAtTo', criteria.createdAtTo);
        addParam('updatedAtFrom', criteria.updatedAtFrom);
        addParam('updatedAtTo', criteria.updatedAtTo);
        addParam('pageNumber', criteria.pageNumber);
        addParam('pageSize', criteria.pageSize);

        const headers = buildAuthHeader(token);
        const url = `${Config.getFullUrl(Config.RESERVATIONS.SEARCH)}${params.toString() ? `?${params.toString()}` : ''}`;

        return fetch(url, { headers })
            .then(handleResponse);
    },

    create(reservation, token) {
        return fetch(Config.getFullUrl(Config.RESERVATIONS.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...buildAuthHeader(token)
            },
            body: JSON.stringify(reservation)
        }).then(handleResponse);
    },

    update(id, reservation, token) {
        return fetch(Config.getFullUrl(Config.RESERVATIONS.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...buildAuthHeader(token)
            },
            body: JSON.stringify(reservation)
        }).then(handleResponse);
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.RESERVATIONS.DELETE(id)), {
            method: "DELETE",
            headers: buildAuthHeader(token)
        }).then(handleResponse);
    }
};

export default ReservationService;
