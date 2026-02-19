# Refactorización de hooks – Menos archivos, menos duplicación

## Problemas detectados

1. **Demasiados archivos** (38 hooks) con responsabilidades muy repartidas; varios hacen casi lo mismo.
2. **Patrón CRUD repetido** en `useEmployeeVehiclePage` y `useEmployeeReservationsPage`:
   - Listado con `usePaginatedSearch` (items, loading, error, filters, pagination, loadItems, handleFilterChange, applyFilters, resetFilters, handlePageChange).
   - Dos formularios (create + edit) con `useFormState` o `useVehicleForm`.
   - Mismo estado de UI: `pageAlert`, `isSubmitting`, `isCreateOpen`, `isEditOpen`, `isEditLoading`, `editXxxId`.
   - Mismos flujos: abrir crear → validar → submit → recargar listado → cerrar modal; abrir editar → cargar por ID o caché → validar → submit → recargar → cerrar; eliminar → confirmar → borrar → recargar.
3. **Catálogo público** (`usePublicCatalogPage`) repite a mano el patrón de búsqueda (vehicles, loading, error, searchVehicles, handleFilterChange, applyFilters, resetFilters) en lugar de reutilizar lógica común con `usePaginatedSearch` o un hook de catálogo.
4. **Formularios y errores**: Varios hooks repiten `clearFieldError(setErrors, name)` en el handler de cambio y el mismo patrón de validación → `setErrors(nextErrors)`.
5. **Hooks “tontos”**: `useClientMyRentalsPage` solo devuelve constantes (emptyMessage, catalogRoute); podría ser config estática o un único hook de configuración por tipo de página.

## Plan de refactorización

### Fase 1 – Bajo riesgo, alto impacto

- **Consolidar páginas cliente mínimas**  
  Unificar `useClientMyRentalsPage` (y similares que solo exponen config) en un solo lugar, p. ej. un mapa de config en `useClientPages.js` o un hook `useClientPageOptions(pageKey)` que devuelva `{ state, ui, actions, options }` según la clave.

- **Utilidad compartida para “form change + clear error”**  
  En `_internal/orchestratorUtils.js` (o en `useFormState`) añadir algo como `createFormChangeHandler(form, setErrors)` que haga `form.handleFormChange(event)` + `clearFieldError(setErrors, event.target.name)` + opcionalmente `form.setFormAlert(null)`. Así no se repite en cada hook de reservas/vehículos.

- **Documentar convención de retorno**  
  Mantener `{ state, ui, actions, options }` como estándar y referenciarlo en este doc para que nuevos hooks no inventen otra estructura.

### Fase 2 – Hook genérico para listado CRUD (empleado)

- **Nuevo hook: `useCrudListPage(options)`** en `core/` o `_internal/`:
  - Opciones: `defaultFilters`, `buildCriteria`, `fetchList`, `fetchById`, `create`, `update`, `delete`, `validateForm`, `mapToFormData`, `messages`, `itemIdKey` (ej. `vehicleId` / `reservationId`), etc.
  - Retorno: mismo contrato `{ state, ui, actions, options }` que hoy (items, filters, pagination, createForm, editForm, modales, handlers de create/edit/delete, filterFields, etc.).
- **Refactorizar** `useEmployeeVehiclePage` y `useEmployeeReservationsPage` para que usen `useCrudListPage` con su configuración específica. Cada uno pasaría a ser un archivo pequeño que solo define la config y llama al hook genérico.

### Fase 3 – Catálogo y búsqueda

- **Unificar búsqueda de vehículos**  
  Valorar un `useVehicleCatalogSearch(baseCriteriaOrNull)` que encapsule:
  - Estado: vehicles, loading, error, filters, lastCriteria.
  - Acciones: search(criteria), handleFilterChange, applyFilters, resetFilters.
  - Criterios: normalización con `normalizeCatalogCriteria` y merge con `buildVehicleSearchCriteria(filters, …)`.
- **Refactorizar** `usePublicCatalogPage` para usar ese hook en lugar de duplicar useState + useCallback del flujo de búsqueda.

## Estructura objetivo (resumida)

- **core/** – Hooks genéricos: `useAuth`, `useTheme`, `useLocale`, `useFormState`, `useAsyncList`, `usePaginatedSearch`, `useModalFocus`, y en su momento `useCrudListPage`.
- **_internal/** – Utilidades compartidas: `orchestratorUtils` (paginación, getInputValueFromEvent, updateFilterValue, clearFieldError, y si se añade: formChangeWithErrorClear).
- **client/** – Un solo archivo o muy pocos: por ejemplo `useClientPages.js` que exporte todos los hooks de cliente y, internamente, use config compartida para páginas “tontas” y `useProfileForm` para perfil.
- **employee/** – Hooks que deleguen en `useCrudListPage` + config (vehículos, reservas, perfil, mantenimiento).
- **public/** – Catálogo que use el nuevo hook de búsqueda de catálogo; el resto de hooks de login/registro/recordatorio pueden quedarse como están o agruparse por flujo.
- **vehicle/, location/, profile/, layout/, misc/** – Mantener por dominio; evitar duplicar lógica que ya exista en core o _internal.

## Próximos pasos recomendados

1. Implementar Fase 1 (consolidar client page options + form change con clear error).
2. Diseñar la API exacta de `useCrudListPage` con los dos casos actuales (vehículos y reservas) y migrar uno de ellos como piloto.
3. Extraer `useVehicleCatalogSearch` y refactorizar `usePublicCatalogPage`.

Con esto se reduce el número de archivos que “hacen lo mismo” y la cantidad de código repetido en hooks.
