# Fase 1: API y config

Contenido:

- **config/**  
  - `api.js`: configuración única (baseUrl + endpoints; nombres como en package-rentexpress.json).  
  - `isoCode.js`: helper para ISO en queries (sin normalizar otros atributos).

- **api/**  
  - `axiosClient.js`: instancia axios, interceptores (auth, 401, dedup), `request()`, `buildParams()`, `toApiError()`, `setAuthToken()`, `setOnUnauthorized()`.  
  - **services/**: un servicio por dominio; solo HTTP, respuestas tal cual.

Servicios: auth, user, employee, vehicle, reservation, rental, config, statistics, role, province, city, headquarters, address, image, vehicleCategory, vehicleStatus, reservationStatus, rentalStatus, weather, recommendation, maintenance.

**Uso cuando `src-new` sea tu `src`:**

```js
import { api, request, authService, vehicleService, setAuthToken } from './api';
// o
import authService from './api/services/authService.js';
```

**Paso 0 (antes de usar en la app):** Renombrar `src` → `src-original`, luego `src-new` → `src`. No modificar `src-original`.
