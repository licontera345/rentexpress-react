# Fase 0 – Contexto para el siguiente agente

Este documento resume **todo lo que se hizo** en el proyecto RentExpress React para que el próximo agente (en la escuela o en otro contexto) sepa el estado actual, las reglas y qué no tocar.

---

## 1. Objetivo del proyecto

- **Rehacer la app React desde cero** usando el código original solo como **referencia**.
- La app original se guardó en **`src-original`** (antes se llamaba `src`). **No se toca.** Solo se consulta para ver comportamiento o estilos.
- La **nueva app** vive en **`src`** (antes se creó en `src-new` y luego se renombró).
- **Fuente de verdad de la API:** `package-rentexpress.json`. Nombres y atributos de la API **no se normalizan** en el front; se usan tal cual devuelve el backend.

---

## 2. Estructura actual de carpetas

```
rentexpress-react/
├── src/                    ← APP NUEVA (aquí se trabaja)
│   ├── main.jsx            ← entry: importa app.css, AuthProvider, App
│   ├── App.jsx             ← BrowserRouter, ErrorBoundary, AppRoutes
│   ├── styles/
│   │   └── app.css         ← único CSS global (base, layout, components, pages)
│   ├── config/             ← api.js (baseUrl, endpoints)
│   ├── api/                ← axiosClient + services (auth, user, vehicle, reservation, etc.)
│   ├── constants/          ← index.js (rutas, roles, storage, UI, createMessages(t))
│   ├── context/            ← AuthContext.jsx
│   ├── hooks/              ← useAuth, useAsync, useAsyncList, usePaginatedSearch, useForm, useToggle, useTheme, useLocale, useHeaderProps
│   ├── utils/              ← api.js, format.js, ui.js, date.js
│   ├── components/
│   │   ├── feedback/       ← Alert, Loading, Empty, Badge
│   │   ├── ui/             ← Button, Card, Modal, FormField, Select, DataTable, Pagination, FilterPanel, SectionHeader, ListResultsPanel
│   │   ├── layout/         ← PublicLayout, PrivateLayout, Header, Footer
│   │   └── auth/           ← ProtectedRoute, ErrorBoundary
│   ├── routes/
│   │   └── Routes.jsx      ← todas las rutas (públicas, privadas por rol)
│   └── pages/
│       ├── public/         ← Home, Login, Register, Catalog, estáticas, NotFound
│       └── private/
│           ├── Dashboard, Profile
│           ├── employee/   ← EmployeeList, ClientList, VehicleList, ReservationsList, RentalsList, PickupVerification
│           └── client/     ← MyReservations, MyRentals, ReservationCreate
├── src-original/           ← APP ANTIGUA. SOLO REFERENCIA. NO TOCAR.
├── index.html              ← script src="/src/main.jsx"
├── PLAN.md                 ← plan por fases (1–7)
├── FASE-0.md               ← este archivo
└── package-rentexpress.json
```

---

## 3. Qué se hizo en cada fase

### Fase 1 – API y config
- **config/api.js:** baseUrl, endpoints alineados con `package-rentexpress.json`.
- **api/axiosClient.js:** instancia axios, interceptores (auth, 401, dedup), `request()`, `buildParams()`, `toApiError()`, `setAuthToken()`, `setOnUnauthorized()`.
- **api/services/:** un servicio por dominio (auth, user, employee, vehicle, reservation, rental, config, statistics, role, province, city, headquarters, address, image, vehicleCategory, vehicleStatus, reservationStatus, rentalStatus, weather, recommendation, maintenance). Solo HTTP; **respuestas sin normalizar**.

### Fase 2 – Constantes
- **constants/index.js:** un solo archivo con rutas (`ROUTES`), roles (`USER_ROLES`), storage, estados, UI, paginación, filtros, sedes, atajos, `createMessages(t)` para i18n.

### Fase 3 – Hooks
- **context/AuthContext.jsx:** AuthProvider (sesión, login/logout, 401 → logout).
- **utils/api.js:** `getResultsList`, `getPaginatedMeta`.
- **hooks/:** useAuth, useAsync, useAsyncList, usePaginatedSearch, useForm, useToggle, useTheme, useLocale, useHeaderProps. Pocos hooks genéricos; las páginas no tienen un hook propio por página, usan composición.

### Fase 4 – Componentes
- **feedback:** Alert, Loading, Empty, Badge.
- **ui:** Button, Card, Modal, FormField, Select, DataTable, Pagination, FilterPanel, SectionHeader, ListResultsPanel.
- **layout:** PublicLayout, PrivateLayout, Header, Footer.
- **auth:** ProtectedRoute, ErrorBoundary.
- Componentes reciben **etiquetas/mensajes por props** (el padre usa `t()` cuando haya i18n).

### Fase 5 – Páginas
- **main.jsx:** ReactDOM, import de `./styles/app.css`, AuthProvider, App.
- **App.jsx:** BrowserRouter, ErrorBoundary, AppRoutes.
- **routes/Routes.jsx:** rutas públicas, privadas (Dashboard, Profile), solo empleado (listas CRUD, PickupVerification), solo cliente (MyReservations, MyRentals, ReservationCreate), 404.
- Páginas en **pages/public/** y **pages/private/** (employee y client). Patrón común: SectionHeader + Card + (FilterPanel) + ListResultsPanel + DataTable.
- **utils/format.js:** formatFullName, isActiveStatus.

### Fase 6 – Estilos
- **styles/app.css:** un único CSS global, ordenado en:
  1. **BASE** – variables (`:root`, `[data-theme='dark']`), reset, body, focus, skip-link, scrollbar, reduced-motion.
  2. **LAYOUT** – header, footer, sidebar, public-layout, private-layout, main-content.
  3. **COMPONENTS** – btn, card, modal (modal-overlay, modal-backdrop, modal, modal-header, modal-body, btn-close), form-field/form-input/alert/loading/empty/badge, pagination, crud-table, search-filters, section-header, list-results-panel.
  4. **PAGES** – login/register/not-found containers y cards, personal-space, dashboard-actions-grid, form-actions, text-muted.
- Importado en **main.jsx** con `import './styles/app.css';`.

### Fase 7 – Utilidades (pendiente)
- Solo utils indispensables y reutilizables. Revisar si falta algo en utils sin añadir lógica innecesaria.

---

## 4. Paso 0 ejecutado (renombrado y fix)

1. **Renombrado de carpetas (lo hizo el usuario):**
   - `src` → `src-original`
   - `src-new` → `src`
   - Así **index.html** sigue apuntando a `/src/main.jsx` y es la app nueva la que arranca.

2. **Fix de export ErrorBoundary:**  
   El módulo `src/components/auth/ErrorBoundary.jsx` exporta **default** (`export default ErrorBoundary`). En `src/components/auth/index.js` se reexportaba como nombrado con `export { ErrorBoundary } from './ErrorBoundary.jsx'`, lo que fallaba. Se cambió a:
   ```js
   export { default as ErrorBoundary } from './ErrorBoundary.jsx';
   ```
   Así `import { ErrorBoundary } from './components/index.js'` en App.jsx funciona.

---

## 5. Convenciones importantes

- **API:** base en dev suele ser `/rentexpress-rest-api/api`; proxy en `vite.config.js` (p. ej. `VITE_PROXY_TARGET` → `http://localhost:8081`). No normalizar respuestas.
- **Constantes:** un solo punto de entrada `constants/index.js`.
- **i18n:** cuando exista, mensajes vía `createMessages(t)`; componentes reciben textos por props.
- **Componentes:** etiquetas y mensajes por **props**; el padre usa `t()` cuando haya i18n.
- **CSS:** una sola hoja `styles/app.css`; no añadir CSS por página ni por componente; reutilizar clases (card, btn, form-field, etc.).
- **Rutas y roles:** definidos en `constants/index.js` (ROUTES, USER_ROLES). ProtectedRoute usa `allowedRoles`.

---

## 6. Cómo arrancar

- `npm run dev` (o el script que use el proyecto). El entry es `src/main.jsx` (ver index.html).
- La app usa `src/styles/app.css`; no hay que importar base.css, common.css ni public.css (esos son de src-original).

---

## 7. Resumen para el próximo agente

- **Trabajar siempre en `src/`.** No modificar `src-original/`; solo consultar.
- **Respetar:** un config para API, constantes centralizadas, servicios sin normalizar, hooks genéricos, componentes con props para textos, un solo `app.css`.
- **Pendiente:** Fase 7 (utils). Cualquier nueva funcionalidad debe seguir el mismo estilo (hooks reutilizables, componentes de feedback/ui/layout/auth, clases de app.css).
- Si algo falla al importar, revisar que los **default export** se reexporten con `export { default as Nombre } from '...'` cuando se quiera usar como export nombrado.
