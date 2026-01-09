/**
 * Configuración centralizada de la aplicación
 */
const Config = {
    API_BASE_URL: "http://94.130.104.92:8084/rentexpress-rest-api/api",
    // API_BASE_URL: "http://localhost:8080/rentexpress-rest-api/api",

    AUTH: {
        LOGIN_USER: "/users/open/authenticate",
        LOGIN_EMPLOYEE: "/employees/open/authenticate"
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
        BY_ID: (id) => `/headquarters/open/${id}`
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
        CREATE: "/addresses",
        UPDATE: (id) => `/addresses/${id}`,
        DELETE: (id) => `/addresses/${id}`
    },

    getFullUrl(endpoint) {
        return this.API_BASE_URL + endpoint;
    }
};

export default Config;