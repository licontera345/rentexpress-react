const Config = {
    API_BASE_URL: "https://94.130.104.92:8443/rentexpress-rest-api/api",

    AUTH: {
        LOGIN_USER: "/users/open/authenticate",
        LOGIN_EMPLOYEE: "/employees/open/authenticate"
    },

    USERS: {
        CREATE_OPEN: "/users/open",
        BY_ID: (id) => `/users/${id}`,
        CREATE: "/users",
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
        SEARCH: "/users/search",
        ACTIVATE: (id) => `/users/${id}/activate`
    },

    EMPLOYEES: {
        BY_ID: (id) => `/employees/${id}`,
        CREATE: "/employees",
        UPDATE: (id) => `/employees/${id}`,
        DELETE: (id) => `/employees/${id}`,
        SEARCH: "/employees/search",
        ACTIVATE: (id) => `/employees/${id}/activate`
    },

    ROLES: {
        ALL: "/roles",
        BY_ID: (id) => `/roles/${id}`
    },

    VEHICLES: {
        BASE: "/vehicles",
        OPEN: "/vehicles/open",
        BY_ID: (id) => `/vehicles/open/${id}`, 
        SEARCH: "/vehicles/open/search",
        CREATE: "/vehicles",
        UPDATE: (id) => `/vehicles/${id}`,
        DELETE: (id) => `/vehicles/${id}`
    },

    VEHICLE_CATEGORIES: {
        ALL: (isoCode) => `/open/vehicle-categories?isoCode=${isoCode}`,
        BY_ID: (id, isoCode) => `/open/vehicle-categories/${id}?isoCode=${isoCode}`
    },

    HEADQUARTERS: {
        ALL: "/headquarters/open",
        BY_ID: (id) => `/headquarters/${id}`,
        CREATE: "/headquarters",
        UPDATE: (id) => `/headquarters/${id}`,
        DELETE: (id) => `/headquarters/${id}`
    },

    RESERVATIONS: {
        BY_ID: (id) => `/reservations/${id}`,
        CREATE: "/reservations",
        UPDATE: (id) => `/reservations/${id}`,
        DELETE: (id) => `/reservations/${id}`,
        SEARCH: "/reservations/search"
    },

    RENTALS: {
        BY_ID: (id) => `/rentals/${id}`,
        CREATE: "/rentals",
        UPDATE: (id) => `/rentals/${id}`,
        DELETE: (id) => `/rentals/${id}`,
        SEARCH: "/rentals/search",
        EXISTS_BY_RESERVATION: (reservationId) => `/rentals/reservations/${reservationId}/exists`,
        FROM_RESERVATION: "/rentals/from-reservation",
        AUTO_CONVERT: "/rentals/auto-convert"
    },

    RESERVATION_STATUSES: {
        ALL: (isoCode) => `/reservation-statuses?isoCode=${isoCode}`,
        BY_ID: (id, isoCode) => `/reservation-statuses/${id}?isoCode=${isoCode}`
    },

    RENTAL_STATUSES: {
        ALL: (isoCode) => `/rental-statuses?isoCode=${isoCode}`,
        BY_ID: (id, isoCode) => `/rental-statuses/${id}?isoCode=${isoCode}`
    },

    VEHICLE_STATUSES: {
        ALL: (isoCode) => `/open/vehicle-statuses?isoCode=${isoCode}`,
        BY_ID: (id, isoCode) => `/open/vehicle-statuses/${id}?isoCode=${isoCode}`
    },

    PROVINCES: {
        ALL: "/provinces",
        BY_ID: (id) => `/provinces/${id}`,
        CREATE: "/provinces",
        UPDATE: (id) => `/provinces/${id}`,
        DELETE: (id) => `/provinces/${id}`
    },

    CITIES: {
        ALL: "/cities/open",
        BY_ID: (id) => `/cities/${id}`,
        BY_PROVINCE: (provinceId) => `/cities/province/${provinceId}`,
        CREATE: "/cities",
        UPDATE: (id) => `/cities/${id}`,
        DELETE: (id) => `/cities/${id}`
    },

    ADDRESSES: {
        BY_ID: (id) => `/addresses/${id}`,
        BY_ID_OPEN: (id) => `/addresses/open/${id}`,
        CREATE_OPEN: "/addresses/open",
        CREATE: "/addresses",
        UPDATE: (id) => `/addresses/${id}`,
        DELETE: (id) => `/addresses/${id}`
    },

    getFullUrl(endpoint) {
        return this.API_BASE_URL + endpoint;
    }
};

export default Config;
