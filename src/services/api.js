import axios from 'axios';
import Config from '../config/Config';

// Crear instancia de axios
const api = axios.create({
    baseURL: Config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para añadir token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Servicios de autenticación
export const AuthService = {
    loginUser: async (credentials) => {
        const response = await api.post(Config.AUTH.LOGIN_USER, credentials);
        return response.data;
    },
    
    loginEmployee: async (credentials) => {
        const response = await api.post(Config.AUTH.LOGIN_EMPLOYEE, credentials);
        return response.data;
    }
};

// Servicios de vehículos
export const VehicleService = {
    findById: async (id) => {
        const response = await api.get(Config.VEHICLES.BY_ID(id));
        return response.data;
    },

    create: async (vehicle) => {
        const response = await api.post(Config.VEHICLES.CREATE, vehicle);
        return response.data;
    },

    update: async (id, vehicle) => {
        const response = await api.put(Config.VEHICLES.UPDATE(id), vehicle);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(Config.VEHICLES.DELETE(id));
        return true;
    },

    search: async (criteria) => {
        const response = await api.get(Config.VEHICLES.SEARCH, { params: criteria });
        return response.data;
    }
};

// Servicios de sedes
export const HeadquartersService = {
    getAll: async () => {
        const response = await api.get(Config.HEADQUARTERS.ALL);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(Config.HEADQUARTERS.BY_ID(id));
        return response.data;
    }
};

// Servicios de categorías
export const VehicleCategoryService = {
    getAll: async (isoCode = 'es') => {
        const response = await api.get(Config.VEHICLE_CATEGORIES.ALL(isoCode));
        return response.data;
    },

    getById: async (id, isoCode = 'es') => {
        const response = await api.get(Config.VEHICLE_CATEGORIES.BY_ID(id, isoCode));
        return response.data;
    }
};

// Servicios de direcciones
export const AddressService = {
    findById: async (id) => {
        const response = await api.get(Config.ADDRESSES.BY_ID(id));
        return response.data;
    },

    create: async (address) => {
        const response = await api.post(Config.ADDRESSES.CREATE, address);
        return response.data;
    },

    update: async (id, address) => {
        const response = await api.put(Config.ADDRESSES.UPDATE(id), address);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(Config.ADDRESSES.DELETE(id));
        return true;
    }
};

export default api;