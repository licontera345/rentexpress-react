# Fase 5: Páginas

Páginas organizadas por zona (public / private por rol). Cada página usa **hooks + componentes**; poca lógica propia.

## Estructura

### Entrada
- **main.jsx** – ReactDOM, AuthProvider, App.
- **App.jsx** – BrowserRouter, ErrorBoundary, AppRoutes.
- **routes/Routes.jsx** – Rutas públicas, privadas (Dashboard, Profile), solo empleado (listas CRUD, PickupVerification), solo cliente (MyReservations, MyRentals, ReservationCreate), 404.

### pages/public/
- **Home** – Hero + enlace al catálogo.
- **Login** – useForm + useAsync + useAuth().login; redirige a Dashboard.
- **Register** – useForm + useAsync + authService.register; redirige a Login.
- **Catalog** – usePaginatedSearch(vehicleService.search), lista + paginación simple.
- **ForgotPassword, ResetPassword, Contact, PrivacyPolicy, TermsOfService** – Contenido estático (en construcción).
- **NotFound** – 404 + enlace a inicio.

### pages/private/
- **Dashboard** – useAuth; si empleado: placeholder estadísticas; si cliente: SectionHeader + Cards de accesos rápidos (Nueva reserva, Mis reservas, Mis alquileres).
- **Profile** – Placeholder edición de perfil.

### pages/private/employee/
- **EmployeeList** – usePaginatedSearch(employeeService.search), FilterPanel, ListResultsPanel, DataTable. Columnas: nombre, email, estado.
- **ClientList** – Igual + modal crear cliente (useForm, useToggle, userService.createPublic), formatFullName, isActiveStatus.
- **VehicleList** – usePaginatedSearch(vehicleService.search), FilterPanel (marca, modelo), DataTable.
- **ReservationsList** – usePaginatedSearch(reservationService.search), ListResultsPanel, DataTable.
- **RentalsList** – usePaginatedSearch(rentalService.search), ListResultsPanel, DataTable.
- **PickupVerification** – Placeholder (reservationService.verifyCode).

### pages/private/client/
- **MyReservations** – usePaginatedSearch con userId del useAuth; ListResultsPanel + DataTable.
- **MyRentals** – Igual con rentalService.
- **ReservationCreate** – Placeholder (formulario reserva en construcción).

## Util
- **utils/format.js** – formatFullName(row), isActiveStatus(value) para listas (solo presentación).

## Criterios
- Sin hooks por página: se reutilizan usePaginatedSearch, useForm, useToggle, useAuth, useAsync.
- Listas CRUD comparten el mismo patrón: SectionHeader + Card + FilterPanel (opcional) + ListResultsPanel + DataTable.
- Rutas protegidas con ProtectedRoute y allowedRoles cuando aplica.
