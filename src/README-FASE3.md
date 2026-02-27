# Fase 3: Hooks reutilizables

Solo **8 hooks** (y un contexto de auth). Las páginas componen estos hooks; no hay un hook por página ni por entidad.

## Hooks

| Hook | Uso |
|------|-----|
| **useAuth** | Dentro de `AuthProvider`. Devuelve `user`, `token`, `login`, `logout`, `updateUser`, `isEmployee`, `isCustomer`, `isAuthenticated`, etc. |
| **useAsync** | Cualquier operación puntual: `const { data, error, loading, run, reset } = useAsync();` luego `run(() => service.findById(id))` o `run(() => service.create(payload))`. |
| **useAsyncList** | Listas que se cargan al montar: `useAsyncList(() => roleService.getAll(), [])` → `{ data, loading, error, reload }`. Para roles, sedes, provincias, categorías, etc. |
| **usePaginatedSearch** | Todas las listas paginadas (empleados, clientes, vehículos, reservas, alquileres). Opciones: `fetchFn(criteria)`, `defaultFilters`, `defaultPageSize`. Devuelve `items`, `filters`, `pagination`, `applyFilters`, `resetFilters`, `goToPage`, `refresh`, etc. |
| **useForm** | Formularios y modales: `useForm(initialValues, { mapFromApi })` → `values`, `setFromEvent`, `setValue`, `reset`, `populate`, `alert`, `setAlert`. |
| **useToggle** | Modales, dropdowns: `useToggle(false)` → `{ on, open, close, toggle }`. |
| **useTheme** | Tema claro/oscuro con persistencia y `data-theme`. |
| **useLocale** | Estado de idioma; cuando exista i18n, sincronizar `setLocale` con `i18n.language`. |

## Contexto

- **AuthContext** + **AuthProvider**: sesión (storage + axios token), login/logout, 401 → logout. Envolver la app con `<AuthProvider>`.

## Util

- **utils/api.js**: `getResultsList(response)`, `getPaginatedMeta(response, fallbacks, resultsLength)` para respuestas de la API.

## Uso en una página de lista (ej. clientes)

```js
import { usePaginatedSearch, useForm, useToggle, useAuth } from './hooks';
import { userService } from './api';
import { PAGINATION } from './constants';

// En el componente:
const { token } = useAuth();
const list = usePaginatedSearch({
  fetchFn: userService.search,
  defaultFilters: { pageSize: PAGINATION.SEARCH_PAGE_SIZE },
});
const createForm = useForm(initialValues, { mapFromApi });
const editForm = useForm(initialValues, { mapFromApi });
const modalCreate = useToggle(false);
const modalEdit = useToggle(false);

// list.items, list.loading, list.applyFilters, list.goToPage...
// createForm.values, createForm.setFromEvent, createForm.reset...
```

Sin hooks por página: la misma combinación de hooks sirve para empleados, vehículos, reservas, alquileres, etc.
