# Flujo reserva → alquiler (idea de producto)

Documento que recoge la idea del flujo real para pasar una reserva a alquiler, con código de recogida y reglas de no-show y devolución. Incluye precisiones, casos límite y mejoras sugeridas.

---

## 1. Resumen del flujo

1. **2 horas antes de la fecha de inicio de recogida**  
   Se envía un correo al usuario con una **clave/código** que servirá para recoger el coche.

2. **En el momento de la recogida**  
   El empleado **toma el código** del cliente. Con ese código se crea el alquiler automáticamente (reserva → rental).

3. **Si no viene nadie (no-show)**  
   Si a **2 horas después de la hora de inicio** de recogida nadie ha presentado el código, se **cancela la reserva**.

4. **En la devolución**  
   El empleado registra los **km finales**. Con eso, el precio del vehículo por día y los días de uso se calcula y se muestra/envía el **coste total** del alquiler.

---

## 2. Detalle por paso

| Momento | Quién | Acción |
|--------|--------|--------|
| **T − 2 h** (respecto a hora de recogida) | Sistema (backend) | Enviar email al usuario con **código de recogida** único para esa reserva. Incluir en el email: referencia de reserva, fecha/hora y sede de recogida. |
| **Recogida** | Empleado + Cliente | Cliente muestra el código (email o app). Empleado lo introduce en la app. Sistema valida código, asocia reserva y **crea el alquiler** (km inicial opcional en este paso). |
| **No-show** | Sistema (backend) | Si a **startDate + 2 h** la reserva no se ha convertido en alquiler → **cancelar** la reserva automáticamente. Opcional: enviar email al usuario informando de la cancelación. |
| **Devolución** | Empleado | Registrar **km finales**. Calcular: precio/día × días (y extras si aplica). Mostrar coste total al cliente y, opcionalmente, enviar resumen por email. |

---

## 3. Precisiones importantes

### 3.1 Ventana de no-show

- **Referencia**: hora de inicio de recogida (`startDate` de la reserva, con hora).
- **Cancelación automática**: exactamente **startDate + 2 horas** (ej.: recogida 10:00 → a las 12:00, si no hay rental, se cancela).
- Si `startDate` es solo fecha (sin hora), definir en backend una hora por defecto (ej. 09:00) para poder aplicar la regla.

### 3.2 Código de recogida

- **Un código por reserva**, generado cuando se envía el email (T − 2 h).
- **Formato sugerido**: corto y fácil de leer/teclear (ej. 6–8 caracteres alfanuméricos, sin caracteres ambiguos como 0/O, 1/I).
- **Validez**: válido desde su generación hasta que la reserva se convierte en alquiler o se cancela (no-show o manual). No reutilizable una vez usado.

---

## 4. Casos límite y reglas de negocio

| Caso | Comportamiento sugerido |
|------|-------------------------|
| Cliente llega **antes** de que se haya enviado el email (antes de T − 2 h) | No tiene código aún. Opción: no permitir recogida hasta T − 2 h, o permitir que el empleado busque la reserva por referencia/ID y cree el rental manualmente (flujo alternativo). |
| Código **ya usado** (reserva ya convertida en rental) | Al introducir el código: mensaje claro "Esta reserva ya fue recogida" y enlace a la ficha del alquiler. |
| Reserva **cancelada** (manual o no-show) antes de que el cliente intente usar el código | Código inválido. Mensaje: "Esta reserva no está activa." |
| Cliente llega **después** de startDate + 2 h (tras no-show) | La reserva ya está cancelada. Si se quiere ser flexible: política de "recuperar" reservas canceladas por no-show (manual en sede) o no permitirlo. Definir en negocio. |
| **Varios intentos** con código erróneo | Límite de intentos (ej. 5) por reserva o por IP/sesión para evitar fuerza bruta. Bloqueo temporal o aviso a empleado. |

---

## 5. Seguridad del código

- Código **no secuencial** ni predecible (generación aleatoria o tipo UUID acortado).
- Almacenado asociado a la reserva (campo o tabla en backend), no en el email en claro como única fuente de verdad (el backend valida contra BD).
- En el email, evitar datos sensibles además del código; incluir solo lo necesario: referencia reserva, fecha/hora, sede, código.

---

## 6. Mejoras opcionales (UX y producto)

- **Km inicial en la recogida**: que el empleado registre los km al crear el rental (tu `RentalDTO` ya tiene `initialKm`). Así el cálculo de uso (km final − km inicial) es posible si en el futuro se cobra por km.
- **Contenido del email (T − 2 h)**: enlace a "Mis reservas", dirección exacta de la sede y teléfono de contacto; recordatorio de documentación (carnet, DNI).
- **Confirmación al crear el rental**: email o notificación al cliente tipo "Tu alquiler #X está activo. Devolución prevista: fecha, sede."
- **Devolución**: pantalla de resumen antes de confirmar (días, precio/día, total, km inicial/final) y opción "Enviar resumen por email" al cliente.
- **Código en la app del cliente**: además del email, mostrar el código en "Mis reservas" (solo para reservas en ventana de recogida) para quien no tenga acceso al correo en el momento.
- **QR en lugar de código**: el cliente muestra un QR que contiene el código; el empleado escanea y la app rellena el código automáticamente (menos errores de tecleo).

---

## 7. Relación con la API actual

| Necesidad | Estado | Notas |
|-----------|--------|--------|
| Crear alquiler desde reserva | Existe | `POST /api/rentals/from-reservation`. |
| Comprobar si ya existe rental para una reserva | Existe | `GET /api/rentals/reservations/{reservationId}/exists`. |
| Código de recogida | Por definir | Backend: generación, almacenamiento, endpoint de validación (ej. `POST /api/reservations/validate-pickup-code` que devuelve reserva y/o crea rental). |
| Email 2 h antes | Por definir | Job/cron en backend; envío de email y generación del código. |
| Cancelación automática no-show | Por definir | Job en backend (startDate + 2 h). |
| Km finales y coste total | Parcial | `RentalDTO` tiene `finalKm`, `totalCost`; backend debe calcular total al guardar devolución (precio/día × días). |

---

## 8. Checklist de implementación (recordatorio)

**Backend**

- [ ] Modelo/dato: código de recogida por reserva (generación, validez, "usado").
- [ ] Job: enviar email 2 h antes con código y datos de la reserva.
- [ ] Endpoint: validar código y crear rental (o devolver reserva para que el front llame a `from-reservation`).
- [ ] Job: cancelar reservas no convertidas a startDate + 2 h (y opcional email de cancelación).
- [ ] Cálculo de `totalCost` al registrar km finales (y posible email con resumen).

**Frontend**

- [ ] Pantalla empleado: introducir código de recogida → validar → crear rental (y opcional km inicial).
- [ ] Mostrar en "Mis reservas" del cliente el código cuando esté en ventana de recogida (si el backend lo expone).
- [ ] Pantalla empleado: devolución (km finales, ver total, confirmar y opcional enviar resumen).

---

*Idea registrada para RentExpress. Documento mejorado con precisiones, casos límite, seguridad y mejoras opcionales. Última actualización: 2025.*
