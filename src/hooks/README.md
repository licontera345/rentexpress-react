# Hooks – Arquitectura

## Regla principal: **un hook por vista**

Cada **pantalla** (página) tiene **un solo hook** que la alimenta. Ese hook es la única entrada de lógica para esa vista y devuelve `{ state, ui, actions, meta }` para que el componente solo renderice.

Ejemplos:
- `Register.jsx` → `usePublicRegisterPage`
- `Catalog.jsx` → `usePublicCatalogPage`
- `ReservationCreate.jsx` → `useClientReservationCreatePage`
- `VehicleList.jsx` → `useEmployeeVehiclePage`

Así la app sigue haciendo lo mismo, con una responsabilidad clara por pantalla.

---

## Hooks genéricos reutilizables

Para no repetir lógica en cada vista, se usan **hooks genéricos** que las vistas (o sus hooks de página) componen:

| Hook | Uso |
|------|-----|
| **useAsyncList** | Cargar cualquier lista (provincias, ciudades, estados, categorías). Un solo patrón: fetch + loading + error. |
| **usePaginatedSearch** | Listados con filtros + paginación (buildCriteria, fetch). Usado por useEmployeeVehiclePage y useEmployeeReservationsPage. |
| **useFormState** | Estado de formularios (valores, cambio, reset, populate). |
| **useAuth** | Usuario, token, roles, logout. |
| **useLocale** / **useTheme** | Idioma y tema. |
| **useHeadquarters** | Sedes (con enriquecimiento de direcciones). |
| **useVehicleDetail** / **useVehicleImage** | Detalle e imagen de un vehículo. |
| **useModalFocus** | Foco y teclado en modales. |

Los hooks de **dominio** (location, vehicle, profile) son **finos**: delegan en `useAsyncList` o en servicios y solo adaptan nombres (ej. `provinces`, `cities`, `statuses`). Así no hay “demasiadas clases”: hay un hook por vista y unos pocos genéricos reutilizables.

**Vistas muy simples** (Home, NotFound, RentalsList, ClientList, EmployeeList): si el hook solo devolvía callbacks de navegación o estado vacío, la lógica puede ir **inline** en la página y no hace falta hook de página.

---

## Estructura de carpetas

```
hooks/
  _internal/     Utilidades compartidas (paginación, filtros, clearFieldError).
  core/          useAuth, useFormState, useAsyncList, usePaginatedSearch, useLocale, useTheme, useModalFocus.
  location/      useHeadquarters, useProvinces, useCities (usan useAsyncList).
  vehicle/       useVehicleCategories, useVehicleStatuses, useVehicleDetail, useVehicleForm, useVehicleImage.
  profile/       useProfileImage.
  misc/          useWeatherPreview.
  public/        Un hook por vista pública (Home, Login, Register, Catalog, etc.).
  private/       usePrivateDashboardPage, usePrivateProfilePage.
  client/        Un hook por vista de cliente (MyReservations, ReservationCreate, Profile, etc.).
  employee/      Un hook por vista de empleado (VehicleList, ReservationsList, etc.).
```

---

## Resumen

- **Una vista → un hook de página** que concentra toda la lógica de esa pantalla.
- **Lógica común → hooks genéricos** (`useAsyncList`, `usePaginatedSearch`, `useFormState`, etc.) para no duplicar código.
- Los hooks de dominio (provinces, cities, statuses, categories) son **adaptadores finos** sobre `useAsyncList` y mantienen la misma API que antes.

Así se reduce la sensación de “demasiados hooks” porque cada archivo tiene un rol claro: o es “la lógica de esta vista” o es “un recurso reutilizable”.
