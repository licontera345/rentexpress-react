import {
  FiBriefcase,
  FiCalendar,
  FiGrid,
  FiTruck,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { MESSAGES, ROUTES } from '../constants';

// Construye los items del menú para empleados.
const buildEmployeeMenuItems = () => [
  { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD, icon: FiGrid },
  { label: MESSAGES.EMPLOYEE_LIST_TITLE, to: ROUTES.EMPLOYEE_LIST, icon: FiBriefcase },
  { label: MESSAGES.CLIENT_LIST_TITLE, to: ROUTES.CLIENT_LIST, icon: FiUsers },
  { label: MESSAGES.VEHICLE_LIST_TITLE, to: ROUTES.VEHICLE_LIST, icon: FiTruck },
  { label: MESSAGES.RESERVATIONS_LIST_TITLE, to: ROUTES.RESERVATIONS_LIST, icon: FiCalendar },
  { label: MESSAGES.RENTALS_LIST_TITLE, to: ROUTES.RENTALS_LIST, icon: FiCalendar },
];

// Construye los items del menú para clientes.
const buildCustomerMenuItems = () => [
  { label: MESSAGES.DASHBOARD, to: ROUTES.DASHBOARD, icon: FiGrid },
  { label: MESSAGES.MY_RESERVATIONS_TITLE, to: ROUTES.MY_RESERVATIONS, icon: FiCalendar },
  { label: MESSAGES.MY_RENTALS_TITLE, to: ROUTES.MY_RENTALS, icon: FiCalendar },
  { label: MESSAGES.PROFILE_TITLE, to: ROUTES.PROFILE, icon: FiUser },
];

// Obtiene los items del menú según el tipo de usuario.
export const getMenuItems = (isEmployee) => {
  return isEmployee ? buildEmployeeMenuItems() : buildCustomerMenuItems();
};
