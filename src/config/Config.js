/**
 * Configuración centralizada de endpoints de la API para la aplicación React RentExpress.
 */
const Config = {
    // URL base de la API
    API_BASE_URL: "https://94.130.104.92:8443/rentexpress-rest-api/api",

    // Endpoints de Autenticación
    AUTH: {
        LOGIN_USER: "/users/open/authenticate",
        LOGIN_EMPLOYEE: "/employees/open/authenticate"
    },

    // Endpoints de Vehículos
    VEHICLES: {
        BASE: "/vehicles",
        OPEN: "/vehicles/open",
        BY_ID: (id) => `/vehicles/open/${id}`, 
        SEARCH: "/vehicles/open/search",
        CREATE: "/vehicles",
        UPDATE: (id) => `/vehicles/${id}`,
        DELETE: (id) => `/vehicles/${id}`
    },

    // Endpoints de Categorías de Vehículos
    VEHICLE_CATEGORIES: {
        ALL: (isoCode) => `/open/vehicle-categories?isoCode=${isoCode}`,
        BY_ID: (id, isoCode) => `/open/vehicle-categories/${id}?isoCode=${isoCode}`
    },

    // Endpoints de Sedes (Headquarters)
    HEADQUARTERS: {
        ALL: "/headquarters/open",
        BY_ID: (id) => `/headquarters/open/${id}`
    },

    // Endpoints de Reservas
    RESERVATIONS: {
        BY_ID: (id) => `/reservations/${id}`,
        CREATE: "/reservations",
        UPDATE: (id) => `/reservations/${id}`,
        DELETE: (id) => `/reservations/${id}`,
        SEARCH: "/reservations/search"
    },

    // Endpoints de Alquileres (Rentals)
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

    // Endpoints de Estados de Reserva
    RESERVATION_STATUSES: {
        ALL: (isoCode) => `/reservation-statuses?isoCode=${isoCode}`,
        BY_ID: (id, isoCode) => `/reservation-statuses/${id}?isoCode=${isoCode}`
    },

    // Endpoints de Estados de Alquiler
    RENTAL_STATUSES: {
        ALL: (isoCode) => `/rental-statuses?isoCode=${isoCode}`,
        BY_ID: (id, isoCode) => `/rental-statuses/${id}?isoCode=${isoCode}`
    },

    // Endpoints de Provincias
    PROVINCES: {
        ALL: "/provinces",
        BY_ID: (id) => `/provinces/${id}`,
        CREATE: "/provinces",
        UPDATE: (id) => `/provinces/${id}`,
        DELETE: (id) => `/provinces/${id}`
    },

    // Endpoints de Ciudades
    CITIES: {
        ALL: "/cities/open",
        BY_ID: (id) => `/cities/${id}`,
        BY_PROVINCE: (provinceId) => `/cities/province/${provinceId}`,
        CREATE: "/cities",
        UPDATE: (id) => `/cities/${id}`,
        DELETE: (id) => `/cities/${id}`
    },

    // Endpoints de Direcciones
    ADDRESSES: {
        BY_ID: (id) => `/addresses/${id}`,
        CREATE: "/addresses",
        UPDATE: (id) => `/addresses/${id}`,
        DELETE: (id) => `/addresses/${id}`
    },

    // Método auxiliar para construir URLs completas
    getFullUrl(endpoint) {
        return this.API_BASE_URL + endpoint;
    }
};

export default Config;
