# RentExpress (React)

Aplicación web frontend para **RentExpress**, plataforma de alquiler de vehículos. Permite a los clientes buscar vehículos, crear reservas y gestionar sus alquileres, y a los empleados administrar vehículos, reservas y clientes.

## Requisitos

- **Node.js** 18+
- **npm** 9+
- Backend **rentexpress-rest-api** en ejecución (para datos y autenticación)

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta si es necesario:

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `VITE_API_BASE_URL` | URL base de la API (por defecto en dev: proxy a `http://localhost:8081/rentexpress-rest-api/api`) |
| `VITE_OPENWEATHER_API_KEY` | Opcional. API Key de OpenWeather para la previsión del tiempo en el resumen de reservas |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Arranca el servidor de desarrollo (Vite) |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Sirve la build de producción localmente |
| `npm run lint` | Ejecuta ESLint |

## Desarrollo

1. Asegúrate de que el backend esté corriendo (por ejemplo en `http://localhost:8081`).
2. Ejecuta el frontend:

   ```bash
   npm run dev
   ```

3. Abre la URL que indique Vite (normalmente `http://localhost:5173`). Las peticiones a `/rentexpress-rest-api` se reenvían al backend mediante el proxy configurado en `vite.config.js`.

## Estructura principal

- `src/api/` – Cliente HTTP (axios), interceptores (401 → logout) y servicios de API
- `src/components/` – Componentes reutilizables y de layout (auth, formularios, listas, etc.)
- `src/config/` – Configuración de API e idioma
- `src/context/` – Contexto de autenticación
- `src/hooks/` – Hooks de lógica por página y utilidades
- `src/pages/` – Páginas públicas (Home, Catálogo, Login, Registro, Contacto, Términos, Privacidad, 404) y privadas (Dashboard, Perfil, listas de empleado/cliente)
- `src/routes/` – Definición de rutas y rutas protegidas por rol
- `src/styles/` – Estilos globales y por sección
- `src/utils/` – Utilidades de formularios, validación, fechas, etc.
- `src/i18n/` – Traducciones (es, en, fr)

## Funcionalidades

- **Público:** inicio, catálogo de vehículos con filtros, login, registro, recuperar contraseña, política de privacidad, términos y condiciones, contacto, página 404
- **Cliente:** panel, perfil, mis reservas, mis alquileres, crear reserva desde el catálogo
- **Empleado:** listas de empleados, clientes, vehículos, reservas y alquileres; gestión de vehículos y reservas; bandeja de mantenimiento
- **Sesión:** cierre automático y redirección a login ante respuestas 401
- **i18n:** español, inglés y francés
- **Error Boundary:** pantalla de error amigable ante fallos no capturados en React

## Tests

```bash
npm run test
```

Incluye tests unitarios de validación y utilidades de formularios (por ejemplo `formValidation`, `reservationFormUtils`).

## Licencia

Uso interno / proyecto académico.
