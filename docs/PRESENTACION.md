# Presentación RentExpress — Guion y diapositivas

Guion para una presentación de **~10 minutos** (2 min negocio + 3 min desarrollo + 5 min demo) con **2–3 diapositivas** de apoyo. Objetivo: ser claro y destacar lo que diferencia a RentExpress.

---

## Diapositivas (2–3 slides)

### Diapositiva 1 — Portada + qué es RentExpress
- **Título:** RentExpress — Plataforma de alquiler de vehículos
- **Subtítulo:** Sistema full-stack de gestión de reservas y alquileres
- **Contenido breve:**
  - Una frase: *“RentExpress permite a clientes reservar vehículos online y a la empresa gestionar flota, reservas, alquileres y empleados desde un único sistema.”*
  - **Puntos clave que te diferencian** (en viñetas):
    - **Multiidioma:** ES, EN, FR (i18n integrado).
    - **Tres perfiles:** Público (catálogo), Cliente (reservas y alquileres), Empleado (gestión completa).
    - **Integraciones:** OpenWeather en el resumen de reserva, Cloudinary para imágenes, autenticación JWT.
    - **Arquitectura en capas:** Frontend React, API REST (Jersey), Middleware (lógica de negocio), base de datos.

### Diapositiva 2 — Stack técnico y arquitectura
- **Título:** Cómo está hecho — Stack y arquitectura
- **Tabla o esquema simple:**

| Capa        | Tecnología |
|-------------|------------|
| Frontend    | React 19, Vite, React Router 7, Axios, i18next, Recharts |
| API         | Jersey (JAX-RS), Maven, WAR en Tomcat |
| Lógica      | Middleware Java (servicios, DAOs), MySQL |
| Extra       | JWT, OpenWeather, Cloudinary, envío de emails |

- **Mensaje clave:** *“Frontend y API separados; API consume el middleware; todo documentado y con manejo de errores y sesión (401 → logout).”*

### Diapositiva 3 (opcional) — Funcionalidades por rol
- **Título:** Qué puede hacer cada usuario
- **Tres columnas o bloques:**
  - **Público:** Catálogo con filtros, registro, login, recuperar contraseña, política de privacidad, contacto.
  - **Cliente:** Dashboard, perfil, mis reservas, mis alquileres, crear reserva desde el catálogo.
  - **Empleado:** CRUD de clientes, empleados, vehículos, reservas, alquileres; bandeja de mantenimiento; verificación de código de recogida; estadísticas (Recharts).

---

## Guion por tiempos

### 1. Negocio (2 minutos)

*“RentExpress es una plataforma de alquiler de vehículos pensada para dos tipos de usuario: el cliente que quiere reservar un coche por internet, y la empresa que necesita gestionar su flota, sus reservas y su equipo.*

*Lo que nos diferencia es, primero, que la misma aplicación sirve para el cliente y para el empleado: el cliente ve catálogo, reservas y alquileres; el empleado tiene un panel con listados y formularios para gestionar clientes, empleados, vehículos, reservas y alquileres, más una bandeja de mantenimiento y estadísticas.*

*Segundo, la aplicación está en tres idiomas — español, inglés y francés — lo que la hace útil para mercados internacionales o turismo.*

*Tercero, no es solo una web de reservas: integramos datos como el tiempo en el resumen de la reserva vía OpenWeather, y usamos Cloudinary para las fotos de los vehículos. La idea es ofrecer una experiencia completa y profesional en un solo producto.”*

---

### 2. Desarrollo (3 minutos)

*“En la parte técnica, RentExpress es un sistema en tres capas.*

*La capa de presentación es una SPA en React 19 con Vite y React Router 7. Usamos Axios para llamar a la API, i18next para los tres idiomas y Recharts para los gráficos del panel de empleados. El frontend solo habla con la API REST; no toca base de datos ni lógica de negocio.*

*La API está hecha con Jersey (JAX-RS) en Java, empaquetada como WAR y desplegada en Tomcat. Expone endpoints REST en JSON y usa autenticación Bearer con JWT. Cuando el token expira o es inválido, el frontend recibe un 401 y redirige al login de forma automática.*

*Por detrás de la API está el middleware: un proyecto Java empaquetado como JAR con toda la lógica de negocio — servicios de usuarios, empleados, vehículos, reservas, alquileres, imágenes, correo, Cloudinary, etc. La API solo orquesta y delega en el middleware. La persistencia es MySQL.*

*Puntos que destacaría: separación clara entre frontend, API y lógica; contrato REST bien definido y centralizado en un config; manejo de errores y sesión unificado; y documentación como el manual de usuario y el README para que cualquiera pueda entender y dar mantenimiento al proyecto.”*

---

### 3. Demo (5 minutos)

Sugerencia de orden para no pasarte de tiempo:

1. **Inicio y catálogo (≈1 min)**  
   Abrir la app, mostrar la página de inicio y el catálogo. Cambiar de idioma (ES/EN/FR) y aplicar un par de filtros (fechas, categoría o sede) para enseñar que el catálogo es público y usable sin login.

2. **Cliente: reserva (≈1,5 min)**  
   Iniciar sesión como cliente. Ir a “Mis reservas” y crear una nueva (o desde el catálogo eligiendo un vehículo). Mostrar selección de sede de recogida/devolución, fechas y, si está configurado, el resumen con el tiempo (OpenWeather). Confirmar la reserva.

3. **Cliente: perfil y alquileres (≈30 s)**  
   Entrar en Perfil y en “Mis alquileres” para que se vea que el cliente tiene su espacio propio.

4. **Empleado: gestión (≈1,5 min)**  
   Cerrar sesión y entrar como empleado. Mostrar el dashboard (gráficos con Recharts). Abrir listados de clientes, vehículos o reservas y un formulario de alta/edición. Mencionar la bandeja de mantenimiento y la verificación del código de recogida si da tiempo.

5. **Cierre (≈30 s)**  
   Resumir en una frase: *“RentExpress une negocio claro — reservas y gestión de flota — con una arquitectura en capas y funcionalidades como multiidioma e integraciones que lo diferencian de una simple web de reservas.”*

---

## Frases clave para cerrar

- *“RentExpress no es solo un catálogo: es un sistema completo de gestión de alquiler de vehículos con tres roles, tres idiomas e integraciones que mejoran la experiencia del usuario y del gestor.”*
- *“Arquitectura en capas, API REST documentada y frontend moderno con React 19 permiten mantener y ampliar el proyecto de forma ordenada.”*

---

## Checklist antes de presentar

- [ ] Diapositivas listas (2 o 3) con poco texto y viñetas claras.
- [ ] Backend y frontend levantados y probados (URL del API y proxy si aplica).
- [ ] Usuario cliente y usuario empleado de prueba con contraseñas que recuerdes.
- [ ] Idioma por defecto elegido para la demo (por ejemplo español).
- [ ] Cronómetro o reloj para respetar 2 + 3 + 5 minutos.

Si quieres, en la carpeta `docs/` puedes añadir un PDF o PPT con estas mismas diapositivas y usar este archivo como guion en papel o en una segunda pantalla.
