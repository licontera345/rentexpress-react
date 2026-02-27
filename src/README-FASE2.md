# Fase 2: Constantes

Un único punto de entrada para todas las constantes: `constants/index.js`.

## Contenido (por sección)

- **Rutas:** `ROUTES` (HOME, LOGIN, CATALOG, etc.).
- **Roles y auth:** `USER_ROLES`, `AUTH_HEADER`, `STORAGE_KEYS`.
- **Estados:** `VEHICLE_STATUS`, `RESERVATION_STATUS`, `STATUS_NAMES`.
- **Tema y UI:** `THEME`, `ALERT_TYPES`, `BUTTON_VARIANTS`, `BUTTON_SIZES`, `BADGE_VARIANTS`, `BADGE_SIZES`, `ALERT_VARIANTS`.
- **Imágenes y negocio:** `IMAGE_CONFIG`, `DEFAULT_ACTIVE_STATUS`, `MIN_AGE_FOR_REGISTER`, `DEFAULT_CURRENCY_SYMBOL`, `DISTANCE_UNIT_KM`, `WEATHER_UNITS`, `TIME_FORMATS`, `DEFAULT_FORM_DATA`.
- **Paginación y filtros:** `PAGINATION`, `PAGINATION_ELLIPSIS`, `FILTER_DEFAULTS`, `getVehicleFilterDefaults(options)`.
- **Home:** `HOME_TRUST_ITEMS`, `HOME_STATS_VALUES`.
- **Sedes:** `getHeadquartersOptionLabel`, `getHeadquartersNameLabel`, `getHeadquartersAddressLabel`, `getHeadquartersCityName`.
- **Atajos:** `SHORTCUT_PREFIX_GO`, `SHORTCUT_HELP_KEYS`, `SHORTCUTS_COMMON`, `SHORTCUTS_EMPLOYEE`, `SHORTCUTS_CUSTOMER`, `getShortcutsForRole(isEmployee)`.
- **Mensajes i18n:** `createMessages(t)` — devuelve un Proxy que delega en `t(key)`; usar cuando i18n esté inicializado.

## Uso

```js
import {
  ROUTES,
  USER_ROLES,
  PAGINATION,
  getHeadquartersOptionLabel,
  getShortcutsForRole,
  createMessages,
} from './constants';

// Mensajes traducidos (cuando tengas i18n):
// const MESSAGES = createMessages(t);
```
