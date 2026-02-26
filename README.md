# RentExpress (React)

A modern web frontend for **RentExpress**, a vehicle rental platform. Customers can browse vehicles, create reservations, and manage their rentals; staff can manage vehicles, reservations, rentals, clients, and employees through a role-based dashboard.

---

## Project Title & Overview

**RentExpress** is a full-stack rental management system. This repository contains the **frontend** (React + Vite). The **backend** is a REST API built with **Jersey** (JAX-RS) and **Maven**, deployed as a WAR (e.g. on Tomcat). Together they form the tech stack required for the project.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, React Router 7, Vite, Axios, i18next (ES, EN, FR), Recharts |
| **Backend** | Jersey (JAX-RS), Maven, Java (WAR deployment) |
| **API contract** | REST over HTTP/JSON; Bearer token authentication |

---

## Features

- **Public:** Home, vehicle catalog with filters, Login, Register, Forgot/Reset password, Privacy Policy, Terms, Contact, 404 page  
- **Customer:** Dashboard, Profile, My Reservations, My Rentals, Create reservation from catalog  
- **Employee:** Lists and CRUD for Employees, Clients, Vehicles, Reservations, Rentals; maintenance inbox; pickup code verification; statistics  
- **Session:** Automatic logout and redirect to login on 401 (expired or invalid token)  
- **i18n:** Spanish, English, French  
- **Error handling:** Error Boundary for uncaught React errors; consistent API error handling  

---

## Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Backend** `rentexpress-rest-api`

### Install and run

```bash
# Install dependencies
npm install
# Start development server
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`). In development, requests to `/rentexpress-rest-api` are proxied to the backend (see **Third-party API integration** below).

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the API (default in dev: `/rentexpress-rest-api/api`, proxied to backend) |
| `VITE_OPENWEATHER_API_KEY` | Optional. OpenWeather API key for weather preview on reservation summary |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |

---

## Third-party API integration

The frontend integrates with two API layers: the **RentExpress REST API** (backend) and, optionally, **OpenWeather** for weather data.

### RentExpress REST API (backend)

- **Endpoints:** All API endpoints are defined in `src/config/apiConfig.js`. The base URL is `Config.API_BASE_URL`; each resource (users, employees, vehicles, reservations, rentals, etc.) has dedicated paths (e.g. `GET /reservations/search`, `POST /reservations`, `PUT /reservations/:id`). Public endpoints (e.g. `/users/open/authenticate`, `/vehicles/open/search`) do not require authentication; protected endpoints require a valid **Bearer token**.
- **Asynchronous requests:** The app uses **Axios** as the HTTP client. Every call to the backend is **asynchronous**: services (e.g. `AuthService`, `ReservationService`) use `async/await` and return Promises. The UI reacts to success or failure via React state and hooks (e.g. `useAsyncList`, `useAuth`), avoiding blocking the main thread.
- **Authentication headers:** After a successful login, the backend returns a **JWT** (or token). The frontend stores it and sends it on every subsequent request in the **Authorization** header using the **Bearer** scheme: `Authorization: Bearer <token>`. This is set centrally in `src/api/axiosClient.js` via `setAuthToken(token)`; the same client is used by all API services, so authenticated requests automatically include the header. If the backend responds with **401 Unauthorized**, a response interceptor clears the session and redirects the user to the login page.
- **Development proxy:** In development, Vite proxies requests to paths such as `/rentexpress-rest-api` to the backend (default `http://localhost:8080`; override with `VITE_PROXY_TARGET` if your Tomcat runs on another port, e.g. 8081). Production builds use the same base path, assuming the app is served behind a reverse proxy or alongside the backend.

### OpenWeather API (optional)

- **Usage:** When `VITE_OPENWEATHER_API_KEY` is set, the app can request weather data for a city (e.g. on the reservation summary). The backend exposes a proxy endpoint (e.g. `GET /open/weather?city=...&lang=...`) that forwards the request to OpenWeather and returns the result. The frontend calls this endpoint via **asynchronous GET** requests; no authentication is required for this open endpoint.

### Si obtienes 404 en endpoints (p. ej. `/headquarters/open`)

1. **Comprueba el puerto del backend:** Por defecto el proxy de Vite apunta a `http://localhost:8080`. Si tu Tomcat usa otro puerto (p. ej. 8081), crea o edita `.env` y define `VITE_PROXY_TARGET=http://localhost:8081`. Reinicia `npm run dev`.
2. **Comprueba la URL base de la API:** Abre en el navegador la URL del backend que uses. Debe responder algo válido (JSON o Swagger), por ejemplo:
   - `http://localhost:8080/rentexpress-rest-api/api/openapi.json`  
   - o, si el WAR está en la raíz: `http://localhost:8080/api/openapi.json`
   Si la API está en la raíz (sin `/rentexpress-rest-api`), en `.env` pon `VITE_API_BASE_URL=/api`.
3. **Context path del WAR:** El backend está pensado para desplegarse con context path `/rentexpress-rest-api` (WAR `rentexpress-rest-api.war`). Si lo despliegas con otro nombre o como ROOT, la base URL en el front debe coincidir (paso 2).

---

## Project structure

- `src/api/` — Axios client, interceptors (401 → logout), API services  
- `src/components/` — Reusable and layout components (auth, forms, lists)  
- `src/config/` — API and locale configuration  
- `src/context/` — Auth context  
- `src/hooks/` — Page logic and utilities  
- `src/pages/` — Public and private pages (employee/client areas)  
- `src/routes/` — Route definitions and role-protected routes  
- `src/styles/` — Global and section styles  
- `src/utils/` — Form validation, dates, API helpers  
- `src/i18n/` — Translations (es, en, fr)  

See [docs/STRUCTURE.md](docs/STRUCTURE.md) for naming and folder conventions.

- **User guide:** For step-by-step instructions to perform CRUD operations and use the application, see [docs/USER_MANUAL.md](docs/USER_MANUAL.md).

---

## License

Internal / academic use.
