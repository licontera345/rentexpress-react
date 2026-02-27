/**
 * Punto único de entrada para la capa API.
 * Uso: import { request, authService, vehicleService } from './api';
 */
export { axiosClient, request, buildParams, setAuthToken, setOnUnauthorized, toApiError, normalizeToken } from './axiosClient.js';
export { default as api } from '../config/api.js';
export { default as authService } from './services/authService.js';
export { default as userService } from './services/userService.js';
export { default as employeeService } from './services/employeeService.js';
export { default as vehicleService } from './services/vehicleService.js';
export { default as reservationService } from './services/reservationService.js';
export { default as rentalService } from './services/rentalService.js';
export { default as configService } from './services/configService.js';
export { default as statisticsService } from './services/statisticsService.js';
export { default as roleService } from './services/roleService.js';
export { default as provinceService } from './services/provinceService.js';
export { default as cityService } from './services/cityService.js';
export { default as headquartersService } from './services/headquartersService.js';
export { default as addressService } from './services/addressService.js';
export { default as imageService } from './services/imageService.js';
export { default as vehicleCategoryService } from './services/vehicleCategoryService.js';
export { default as vehicleStatusService } from './services/vehicleStatusService.js';
export { default as reservationStatusService } from './services/reservationStatusService.js';
export { default as rentalStatusService } from './services/rentalStatusService.js';
export { default as weatherService } from './services/weatherService.js';
export { default as recommendationService } from './services/recommendationService.js';
export { default as maintenanceService } from './services/maintenanceService.js';
