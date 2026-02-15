import { normalizeIsoCodeForApi } from './isoCode';

const Config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/rentexpress-rest-api/api',

    AUTH: {
        // Endpoints de autenticación para usuarios y empleados.
        LOGIN_USER: "/users/open/authenticate",
        LOGIN_EMPLOYEE: "/employees/open/authenticate"
    },

    USERS: {
        // Rutas de gestión de usuarios.
        CREATE_OPEN: "/users/open",
        BY_ID: (id) => `/users/${id}`,
        CREATE: "/users",
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
        SEARCH: "/users/search",
        ACTIVATE: (id) => `/users/${id}/activate`
    },

    EMPLOYEES: {
        // Rutas de gestión de empleados.
        BY_ID: (id) => `/employees/${id}`,
        CREATE: "/employees",
        UPDATE: (id) => `/employees/${id}`,
        DELETE: (id) => `/employees/${id}`,
        SEARCH: "/employees/search",
        ACTIVATE: (id) => `/employees/${id}/activate`
    },

    ROLES: {
        // Rutas de roles del sistema.
        ALL: "/roles",
        BY_ID: (id) => `/roles/${id}`
    },

    VEHICLES: {
        // Rutas de vehículos (públicas y privadas).
        BASE: "/vehicles",
        OPEN: "/vehicles/open",
        BY_ID: (id) => `/vehicles/open/${id}`, 
        SEARCH: "/vehicles/open/search",
        CREATE: "/vehicles",
        UPDATE: (id) => `/vehicles/${id}`,
        DELETE: (id) => `/vehicles/${id}`,
        MAINTENANCE_INBOX: "/vehicles/finMantenimiento"
    },

    IMAGES: {
        USER_BY_ID: (userId) => `/images/users/${userId}`,
        EMPLOYEE_BY_ID: (employeeId) => `/images/employees/${employeeId}`,
        VEHICLE_BY_ID: (vehicleId) => `/images/vehicles/${vehicleId}`,
        BY_ID: (imageId) => `/images/${imageId}`
    },

    CLOUDINARY: {
        SIGNATURE: "/open/cloudinary/signature"
    },

    VEHICLE_CATEGORIES: {
        // Catálogos de categorías con soporte de idioma.
        ALL: (isoCode) => `/open/vehicle-categories?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
        BY_ID: (id, isoCode) => `/open/vehicle-categories/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
    },

    HEADQUARTERS: {
        // Rutas para sedes y su administración.
        ALL: "/headquarters/open",
        BY_ID: (id) => `/headquarters/${id}`,
        CREATE: "/headquarters",
        UPDATE: (id) => `/headquarters/${id}`,
        DELETE: (id) => `/headquarters/${id}`
    },

    RESERVATIONS: {
        // Rutas para la gestión de reservas.
        BY_ID: (id) => `/reservations/${id}`,
        CREATE: "/reservations",
        UPDATE: (id) => `/reservations/${id}`,
        DELETE: (id) => `/reservations/${id}`,
        SEARCH: "/reservations/search"
    },

    RENTALS: {
        // Rutas para alquileres y acciones relacionadas.
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
        // Estados de reserva con traducciones.
        ALL: (isoCode) => `/reservation-statuses?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
        BY_ID: (id, isoCode) => `/reservation-statuses/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
    },

    RENTAL_STATUSES: {
        // Estados de alquiler con traducciones.
        ALL: (isoCode) => `/rental-statuses?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
        BY_ID: (id, isoCode) => `/rental-statuses/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
    },

    VEHICLE_STATUSES: {
        // Estados de vehículos con traducciones.
        ALL: (isoCode) => `/open/vehicle-statuses?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
        BY_ID: (id, isoCode) => `/open/vehicle-statuses/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
    },

    PROVINCES: {
        // Rutas de provincias.
        ALL: "/provinces",
        BY_ID: (id) => `/provinces/${id}`,
        CREATE: "/provinces",
        UPDATE: (id) => `/provinces/${id}`,
        DELETE: (id) => `/provinces/${id}`
    },

    CITIES: {
        // Rutas de ciudades y filtros por provincia.
        ALL: "/cities/open",
        BY_ID: (id) => `/cities/${id}`,
        BY_PROVINCE: (provinceId) => `/cities/province/${provinceId}`,
        CREATE: "/cities",
        UPDATE: (id) => `/cities/${id}`,
        DELETE: (id) => `/cities/${id}`
    },

    ADDRESSES: {
        // Rutas para direcciones y creación pública.
        BY_ID: (id) => `/addresses/${id}`,
        BY_ID_OPEN: (id) => `/addresses/open/${id}`,
        CREATE_OPEN: "/addresses/open",
        CREATE: "/addresses",
        UPDATE: (id) => `/addresses/${id}`,
        DELETE: (id) => `/addresses/${id}`
    },

    // Ayuda para construir la URL completa a partir del endpoint.
    getFullUrl(endpoint) {
        return this.API_BASE_URL + endpoint;
    }
};

export default Config;
