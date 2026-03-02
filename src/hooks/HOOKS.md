# Estrategia de hooks

Los hooks están organizados en **capas**: primitivas reutilizables en `core/` y hooks de página que las componen.

## Primitivas (`core/`)

- **`useAsyncList(fetcher, deps, options)`** – Lista asíncrona genérica (una carga o cuando cambian `deps`). Opciones: `skip`, `emptyMessage`. Retorna `{ data, loading, error, reload }`. Úsalo para cualquier lista que no requiera paginación ni filtros (catálogos, listas simples por usuario, etc.).
- **`useAsyncData(fetcher, deps, options)`** – Igual que useAsyncList pero sin aplicar getResultsList: guarda el resultado tal cual. Opciones: `skip`, `errorMessage`. Retorna `{ data, loading, error, reload }`. Útil para dashboard (varios datos en uno), config (filterRanges), etc.
- **`useCatalogList(fetcher, deps, options)`** – Igual que `useAsyncList` pero además construye un mapa por ID. Opciones: `idKey` (ej. `'categoryId'`, `'vehicleStatusId'`). Retorna `{ data, loading, error, reload, dataById }`. Ideal para estados, categorías, sedes cuando necesitas buscar por id.
- **`usePaginatedSearch({ defaultFilters, buildCriteria, fetch, defaultPageSize, errorMessage })`** – Lista con filtros y paginación. Para listados de empleado (clientes, reservas, vehículos, etc.).
- **`useFormState({ initialData, mapData })`** – Estado de formulario con `formData`, `handleFormChange`, `populateForm`, `resetForm`, `setFormAlert`.
- **`useAuth`**, **`useLocale`**, **`useTheme`**, **`useModalFocus`** – Contexto y utilidades globales.

## Cómo reducir duplicación

1. **Lista sin paginación** (ej. “mis alquileres”, “mis reservas”, catálogo de provincias/sedes): usar **`useAsyncList`** (o **`useCatalogList`** si necesitas mapa por id). Evita repetir `useState` + `useEffect` + `startAsyncLoad` + `getResultsList`.
2. **Lista con filtros y paginación**: usar **`usePaginatedSearch`** y pasar `defaultFilters`, `buildCriteria` y `fetch`. Los hooks de página de empleado (clientes, reservas, vehículos) ya lo usan.
3. **Catálogos** (estados, categorías, sedes, ciudades): preferir **`useAsyncList`** o **`useCatalogList`** en lugar de implementar la carga a mano (como en `useHeadquarters`, `useVehicleStatuses`, `useCities`, `useProvinces`).
4. **Formularios de página** (login, registro, crear/editar): usar **`useFormState`** y las utilidades de `_internal/orchestratorUtils` (`handleFormChangeAndClearError`, `withSubmitting`).

## Hooks de página

Los hooks por página (ej. `useClientMyRentalsPage`, `useEmployeeReservationsPage`) deben **componer** las primitivas anteriores y exponer solo `state`, `ui`, `actions` y `options` para la vista. La lógica específica (quick actions, conteos, modales) sigue en el hook de página; la carga de datos y el estado de listas se delegan a las primitivas para que sean más dinámicos y reutilizables.
