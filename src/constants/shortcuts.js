import { ROUTES } from './routes';
import { USER_ROLES } from './config';

export const SHORTCUT_PREFIX_GO = 'g';

export const SHORTCUT_HELP_KEYS = ['?', 'Shift+/'];

export const SHORTCUTS_COMMON = [
  { key: 'd', route: ROUTES.DASHBOARD, labelKey: 'DASHBOARD' },
  { key: 'p', route: ROUTES.PROFILE, labelKey: 'PROFILE_TITLE' },
];

export const SHORTCUTS_EMPLOYEE = [
  { key: 'e', route: ROUTES.EMPLOYEE_LIST, labelKey: 'EMPLOYEE_LIST_TITLE' },
  { key: 'c', route: ROUTES.CLIENT_LIST, labelKey: 'CLIENT_LIST_TITLE' },
  { key: 'v', route: ROUTES.VEHICLE_LIST, labelKey: 'VEHICLE_LIST_TITLE' },
  { key: 'r', route: ROUTES.RESERVATIONS_LIST, labelKey: 'RESERVATIONS_LIST_TITLE' },
  { key: 'a', route: ROUTES.RENTALS_LIST, labelKey: 'RENTALS_LIST_TITLE' },
  { key: 'u', route: ROUTES.PICKUP_VERIFICATION, labelKey: 'PICKUP_VERIFICATION_TITLE' },
];

export const SHORTCUTS_CUSTOMER = [
  { key: 'n', route: ROUTES.RESERVATION_CREATE, labelKey: 'NAV_NEW_RESERVATION' },
  { key: 'r', route: ROUTES.MY_RESERVATIONS, labelKey: 'MY_RESERVATIONS_TITLE' },
  { key: 'a', route: ROUTES.MY_RENTALS, labelKey: 'MY_RENTALS_TITLE' },
];

export function getShortcutsForRole(isEmployee) {
  const list = [...SHORTCUTS_COMMON];
  if (isEmployee) {
    list.push(...SHORTCUTS_EMPLOYEE);
  } else {
    list.push(...SHORTCUTS_CUSTOMER);
  }
  return list;
}
