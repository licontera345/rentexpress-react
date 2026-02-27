# Plan: Nueva aplicación React (src desde cero)

**Regla de oro:** `src-original` (antes `src`) **no se toca**. Es la referencia. El JSON `package-rentexpress.json` es la fuente de verdad de atributos y valores; **no se normaliza nada**.

---

## Paso 0 – Antes de empezar (lo haces tú)

1. Renombrar la carpeta `src` → `src-original`.
2. La nueva app vivirá en `src` (creada paso a paso). Si se crea primero en `src-new`, al terminar la fase que quieras: renombrar `src-new` → `src`.

---

## Fase 1 – API y config (PRIMERA ENTREGA)

- **1.1** Un solo **config** para la API: `config/api.js` (base URL, endpoints; nombres igual que en `package-rentexpress.json`).
- **1.2** **axios**: una instancia, interceptores (auth, 401, dedup de requests), `request()`, `toApiError()`, `setAuthToken()`, `buildParams()`.
- **1.3** **Services**: un servicio por dominio (auth, users, employees, vehicles, reservations, rentals, etc.). Solo llamadas HTTP; respuestas tal cual (sin normalizar). Reutilizar config y axios en todos.

**Criterio de listo:** Podemos llamar a la API desde consola o un test mínimo usando solo `src` nuevo; middleware y rest-api igual que ahora.

---

## Fase 2 – Constantes ✅

- **2.1** Un único punto de constantes: `constants/index.js` (o un solo archivo bien estructurado). Rutas de app, roles, storage keys, auth header, paginación, mensajes, etc. Sin duplicar valores.
- **Hecho:** `src-new/constants/index.js` con todo en un solo archivo organizado por secciones (rutas, roles, storage, estados, UI, paginación, filtros, sedes, atajos, `createMessages(t)` para i18n).

---

## Fase 3 – Hooks reutilizables y abstractos ✅

- **3.1** Pocos hooks genéricos: datos (lista paginada, lista simple, uno por id), formulario, auth, locale/theme si aplica.
- **3.2** Los hooks de “página” se reducen a composición de estos hooks + config específica (no un hook por cada página).

- **3.1** Pocos hooks genéricos: datos (lista paginada, lista simple, uno por id), formulario, auth, locale/theme si aplica.
- **3.2** Los hooks de "página" se reducen a composición de estos hooks + config específica (no un hook por cada página).
- **Hecho:** 8 hooks (useAuth, useAsync, useAsyncList, usePaginatedSearch, useForm, useToggle, useTheme, useLocale), AuthContext, utils/api.js.

---

## Fase 4 – Componentes reutilizables ✅

- **4.1** Layout: público, privado, header, footer.
- **4.2** UI común: botón, card, formulario (campos), tabla de datos, paginación, filtros, modales.
- **4.3** Estados: loading, error, empty → componentes reutilizables (no repetir el mismo JSX en cada página). “Quien normaliza y quien carga errores” también como componentes reutilizables.
- **4.4** Lógica padre–hijo e hijo–padre clara (props, callbacks, sin sobre-complicar).
- **Hecho:** feedback, ui, layout, auth (ver README-FASE4).

---

## Fase 5 – Páginas ✅

- **5.1** Páginas organizadas por zona: public / private (client / employee).
- **5.2** Cada página usa hooks + componentes; poca lógica propia, nada de código repetido innecesario.
- **Hecho:** main.jsx, App.jsx, routes/Routes.jsx; pages/public (Home, Login, Register, Catalog, estáticas, NotFound); pages/private (Dashboard, Profile); pages/private/employee (EmployeeList, ClientList, VehicleList, ReservationsList, RentalsList, PickupVerification); pages/private/client (MyReservations, MyRentals, ReservationCreate). utils/format.js (formatFullName, isActiveStatus).

---

## Fase 6 – Estilos ✅

- **6.1** Un solo CSS global (o un único entry que importe secciones). Bien organizado por bloques (base, layout, components, pages). Sin duplicar estilos ni tonterías por página.
- **Hecho:** `src-new/styles/app.css` (base, layout, components, pages). Importado en `main.jsx`.

---

## Fase 7 – Utilidades

- **7.1** Solo utils indispensables y reutilizables (p. ej. formateo de fechas, helpers de respuesta API si hace falta). Sin lógica que haga más de lo necesario; la lógica pesada en backend/middleware.

---

## Orden de ejecución

1. **Paso 0** (tú): renombrar `src` → `src-original`.
2. **Fase 1**: config + axios + services (esta entrega).
3. Luego Fase 2 → 3 → 4 → 5 → 6 → 7, paso a paso, comprobando cada una antes de seguir.

---

## Referencias

- **API / atributos:** `package-rentexpress.json` (no normalizar nombres).
- **Comportamiento actual:** `src-original` + middleware + rentexpress-rest-api.
