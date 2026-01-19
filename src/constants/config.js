export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  SEARCH_VEHICLES: '/search-vehicles',
  CATALOG: '/catalog',
  REGISTER: '/register',
  
  // Private
  DASHBOARD: '/dashboard',
  MY_RESERVATIONS: '/my-reservations',
  PROFILE: '/profile',
  MANAGE_VEHICLES: '/manage-vehicles',
  ADD_VEHICLE: '/add-vehicle',
  EDIT_VEHICLE: '/edit-vehicle',
};

export const API_ENDPOINTS = {
  SEARCH_VEHICLES: 'search',
  GET_ALL_CATEGORIES: 'getAll',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 100,
};

export const FILTER_DEFAULTS = {
  BRAND: '',
  MIN_PRICE: '',
  MAX_PRICE: '',
  CATEGORY_ID: '',
};

export const RESERVATION_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
};

export const DEFAULT_FORM_DATA = {
  VEHICLE: {
    brand: '',
    model: '',
    licensePlate: '',
    dailyPrice: '',
    mileage: '0',
    year: new Date().getFullYear().toString(),
    vin: '',
    categoryId: '',
    description: '',
    status: VEHICLE_STATUS.AVAILABLE,
  },
  LOGIN: {
    email: '',
    password: '',
    rememberMe: false,
  },
  USER_PROFILE: {
    name: '',
    email: '',
    phone: '',
    document: '',
  },
};

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};
