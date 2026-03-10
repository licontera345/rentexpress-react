# Presentación RentExpress — Guion para el profesor

**Objetivo:** Explicar el proyecto RentExpress en dos bloques: **negocio** (problema, beneficios, qué ofrece la app) y **soluciones técnicas** (capas, servicios, herramientas y tecnologías).

---

## Parte 1 — El negocio

### 1.1 El problema de la empresa

- La empresa de **alquiler de vehículos** necesita **mejorar la comodidad** tanto de **clientes** como de **empleados**.
- **Antes:** procesos manuales o dispersos (reservas, consultas, gestión de flota y de clientes) que generan:
  - Más tiempo de gestión y posibles errores.
  - Peor experiencia para el cliente (reservar, ver disponibilidad, recoger el coche).
  - Más carga operativa para el personal (listados, búsquedas, verificación de códigos de recogida, mantenimiento).
- La empresa quiere **una aplicación** que centralice y automatice estos procesos para **dar más comodidad** a clientes y empleados.

### 1.2 ¿A qué le da solución?

- **A los clientes:** reservar coches desde casa, ver catálogo y disponibilidad, gestionar sus reservas y alquileres, recuperar contraseña, ver tiempo en la ciudad de recogida y recibir un código de recogida por email.
- **A los empleados:** un panel único para gestionar clientes, empleados, vehículos, reservas, alquileres, mantenimiento, verificación del código de recogida y estadísticas.
- **A la empresa:** un único sistema (base de datos, reglas de negocio, integraciones) en lugar de procesos desconectados.

### 1.3 Beneficios del cambio

- **Comodidad para el cliente:** reserva 24/7, catálogo con filtros, recomendaciones (IA), chat de soporte, multiidioma (ES, EN, FR), login con Google, 2FA.
- **Comodidad para el empleado:** listados y CRUD centralizados, bandeja de mantenimiento, verificación de código de recogida, estadísticas (ingresos, reservas, flota, sedes).
- **Menos errores y más control:** flujo claro reserva → alquiler, código de recogida por email, asignación de vehículos y sedes (recogida/devolución).

### 1.4 Qué ofrece la app (resumen)

| Público   | Qué puede hacer |
|----------|-------------------|
| **Público** | Home, catálogo de vehículos con filtros, login, registro, recuperar contraseña, política de privacidad, términos, contacto. |
| **Cliente** | Dashboard, perfil, mis reservas, mis alquileres, crear reserva desde el catálogo, ver tiempo en la ciudad de recogida, recomendaciones (IA), chat de soporte con empleados. |
| **Empleado** | CRUD de empleados, clientes, vehículos, reservas, alquileres; sedes; bandeja de mantenimiento; verificar código de recogida; estadísticas (ingresos, reservas, flota, sedes); chat con clientes. |

---

## Parte 2 — Las soluciones técnicas

### 2.1 Arquitectura en capas

El sistema se divide en **cuatro capas**:

1. **Base de datos** — Persistencia (MySQL).
2. **Middleware** — Lógica de negocio, acceso a BD e integraciones (Java, JAR).
3. **REST API** — Contratos HTTP/JSON, autenticación, caché (Jersey/JAX-RS, WAR en Tomcat).
4. **Frontend** — Interfaz web para clientes y empleados (React + Vite).

El flujo es: **Frontend → REST API → Middleware → Base de datos** (y Middleware/API hacia servicios externos).

### 2.2 Base de datos

- **Motor:** MySQL 8 (utf8mb4).
- **Qué almacena:** usuarios, empleados, roles, sedes, direcciones, ciudades, provincias, vehículos, categorías de vehículo, imágenes (referencias a Cloudinary), reservas, alquileres, estados de reserva/alquiler, conversaciones y mensajes de chat, códigos de recogida, tokens (recuperación de contraseña, JWT invalidados), etc.
- **Herramientas:** script SQL (`rentexpress.sql`), diseño con FKs e índices para integridad y rendimiento.

### 2.3 Middleware (rentexpress-middleware)

- **Tecnología:** Java 8, Maven, JAR.
- **Responsabilidades:**
  - Acceso a datos (DAOs con JDBC): reservas, alquileres, vehículos, usuarios, empleados, sedes, imágenes, conversaciones, etc.
  - Lógica de negocio: creación de reservas, comprobación de disponibilidad, conversión reserva → alquiler, generación de código de recogida, asignación de vehículos.
  - Integraciones: **Cloudinary** (imágenes), **SMTP** (emails, p. ej. código de recogida), **FixAuto** (mantenimiento de vehículos, matrícula/VIN).
- **Librerías relevantes:** Cloudinary, Apache Commons (lang, email), Jasypt, Gson, HttpClient, MySQL connector (provided).

### 2.4 REST API (rentexpress-rest-api)

- **Tecnología:** Java 11, Jersey (JAX-RS) 3.x, Maven, WAR desplegada en Tomcat.
- **Responsabilidades:**
  - Exponer endpoints REST (JSON): usuarios, empleados, vehículos, reservas, alquileres, sedes, imágenes, estadísticas, auth, etc.
  - Autenticación: JWT (Bearer), login cliente/empleado, Google OAuth, 2FA (verificación TOTP).
  - Caché con **Redis** (p. ej. búsquedas de reservas) para reducir carga en BD.
  - Integraciones expuestas a la app: **OpenWeather** (tiempo por ciudad), **Groq** (recomendaciones de vehículos con IA), firma **Cloudinary** para subida de imágenes desde el cliente.
  - Documentación: Swagger/OpenAPI.
- **Librerías relevantes:** Jersey (servlet, HK2, JSON, multipart), Swagger, Jedis (Redis), JJWT, Jasypt, BCrypt, Gson, Commons Email, C3P0, Google API Client; dependencia del JAR del middleware.

### 2.5 Frontend (rentexpress-react)

- **Tecnología:** React 19, React Router 7, Vite (Rolldown), Axios, i18next (ES, EN, FR), Recharts.
- **Responsabilidades:**
  - Pantallas públicas: home, catálogo, login, registro, recuperar contraseña, contacto, políticas.
  - Área cliente: dashboard, perfil, mis reservas, mis alquileres, crear reserva desde catálogo, chat de soporte (WebSocket).
  - Área empleado: listados y formularios de clientes, empleados, vehículos, reservas, alquileres, sedes; mantenimiento; verificación de código de recogida; estadísticas (gráficos).
  - Comunicación con la API por HTTP (Axios) y WebSocket para el chat; token JWT en cabecera; manejo de 401 (logout).
- **Herramientas:** npm, Vite; en desarrollo, proxy hacia el backend (Tomcat).

### 2.6 Servicios que ofrece el sistema (resumen)

| Área            | Servicios / Funcionalidad |
|-----------------|----------------------------|
| **Auth**        | Login usuario/empleado, Google OAuth, 2FA, forgot/reset password. |
| **Usuarios**    | CRUD, búsqueda, activación, configuración 2FA. |
| **Empleados**   | CRUD, búsqueda, activación, por sede. |
| **Vehículos**   | CRUD, búsqueda pública (catálogo), categorías, estados, bandeja de fin de mantenimiento. |
| **Imágenes**    | Subida (firma Cloudinary), asociación a usuario/empleado/vehículo. |
| **Reservas**    | CRUD, búsqueda con criterios, estimación de precio, generación y verificación de código de recogida. |
| **Alquileres**  | CRUD, búsqueda, creación desde reserva, auto-conversión, completar alquiler. |
| **Sedes**       | CRUD, listado público (para elegir recogida/devolución). |
| **Estadísticas**| Dashboard, ingresos, ingresos mensuales, reservas, flota, sedes. |
| **Tiempo**      | OpenWeather por ciudad (proxy en la API). |
| **Recomendaciones** | Groq (IA) para sugerir vehículos. |
| **Chat**        | Conversaciones cliente–empleado, mensajes en tiempo real (WebSocket), asignación de empleado. |
| **Config**      | Rangos de filtros, configuración de subida de imágenes. |

### 2.7 Herramientas y tecnologías (resumen)

| Capa       | Herramientas / Tecnologías |
|------------|----------------------------|
| **BD**     | MySQL 8, script SQL, diseño relacional (tablas, FKs, índices). |
| **Middleware** | Java 8, Maven, JDBC, Cloudinary, Apache Commons (lang, email), Jasypt, Gson, HttpClient; integración FixAuto, SMTP. |
| **API**    | Java 11, Maven, Jersey (JAX-RS) 3.x, Servlet 5, Swagger, Redis (Jedis), JWT (JJWT), BCrypt, Jasypt, C3P0, Google API Client; OpenWeather, Groq, firma Cloudinary; despliegue WAR en Tomcat. |
| **Frontend** | React 19, React Router 7, Vite (Rolldown), Axios, i18next, Recharts, React OAuth Google; proxy a backend en desarrollo. |
| **Integraciones** | Cloudinary (imágenes), OpenWeather (tiempo), Groq (recomendaciones IA), FixAuto (mantenimiento), SMTP (email), Google OAuth, Redis (caché), WebSocket (chat). |

---

## Cierre sugerido

- **Negocio:** La app responde al problema de comodidad de clientes y empleados centralizando reservas, alquileres, gestión de flota y soporte (incluido chat y recomendaciones con IA).
- **Técnico:** Solución en cuatro capas (BD → Middleware → API → Frontend), con servicios claros, uso de estándares (REST, JWT, WebSocket) y herramientas modernas (React, Vite, Jersey, Redis, MySQL, Cloudinary, OpenWeather, Groq, etc.), preparada para seguir creciendo (p. ej. reservas por modelo/categoría según el diseño en `DESIGN_RESERVAS_POR_MODELO_FASE0.md`).

---

*Documento generado a partir del análisis de rentexpress_middleware, rentexpress-rest-api y rentexpress-react. Puedes usar este guion como base para las diapositivas o el discurso de la presentación.*
