# Análisis de Problemas Arquitectónicos - RentExpress

## 🔴 PROBLEMAS CRÍTICOS

### 1. **Duplicación masiva de lógica de normalización**

**Problema:** Hay ~15 funciones `normalizeEntity`, `resolveX`, `buildX` dispersas por todo el código haciendo exactamente lo mismo.

**Ubicaciones:**
- `src/components/common/modal/VehicleDetailModal.jsx` (líneas 18-90)
- `src/config/headquartersLabels.js` (línea 1)
- `src/components/reservations/ReservationListItem.jsx` (línea 3)
- `src/hooks/useUserReservations.js` (línea 16)
- Más en ProfileClient, ProfileEmployee, etc.

**Impacto:** 
- ~300 líneas de código redundante
- Bugs inconsistentes (un lugar maneja `null`, otro no)
- Imposible mantener

**Solución simple:**
```javascript
// src/utils/entityNormalizers.js
export const normalize = (value) => Array.isArray(value) ? value[0] : value;

export const getId = (entity, ...keys) => {
  const normalized = normalize(entity);
  for (const key of keys) {
    const val = normalized?.[key];
    if (val != null) return Number(val);
  }
  return null;
};

export const getName = (entity, ...keys) => {
  const normalized = normalize(entity);
  for (const key of keys) {
    const val = normalized?.[key];
    if (val) return String(val);
  }
  return '';
};
```

**Reemplazo:**
```javascript
// Antes (20 líneas):
const resolveStatusLabel = (vehicle) => {
  const statusId = Number(
    vehicle?.vehicleStatusId
    ?? vehicle?.vehicleStatus?.vehicleStatusId
    ?? vehicle?.statusId
    ?? vehicle?.status?.vehicleStatusId
  );
  // ... más código
};

// Después (2 líneas):
import { getId, getName } from '@/utils/entityNormalizers';
const statusId = getId(vehicle, 'vehicleStatusId', 'vehicleStatus.vehicleStatusId', 'statusId');
```

---

### 2. **Hooks que no son hooks**

**Problema:** `useApi.js`, `useVehicleForm.js`, `useEmployeeVehicleList.js` son servicios disfrazados de hooks.

**Por qué está mal:**
- `useApi` es solo un wrapper de `useEffect` + `useState` → No aporta nada
- `useVehicleForm` es un objeto de estado con helpers → Debería ser un reducer o contexto
- `useEmployeeVehicleList` mezcla UI state + API calls + transformaciones

**Ejemplo del problema:**
```javascript
// src/hooks/useApi.js - 30 líneas para hacer esto:
const useApi = (apiCallFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // ... solo wrappea useEffect
};

// Esto se usa UNA VEZ en todo el proyecto
// Solución: Bórralo y usa useEffect directamente
```

**Hooks que SÍ tiene sentido mantener:**
- ✅ `useAuth` - Contexto real
- ✅ `useLocale` - Suscripción a i18n
- ✅ `useTheme` - Estado persistente
- ❌ `useApi` - Wrapper inútil
- ❌ `useVehicleForm` - Debería ser un reducer
- ❌ `useHomePage` - Solo retorna un callback

---

### 3. **Servicios API con abstracción innecesaria**

**Problema:** Todos los servicios tienen esta estructura:
```javascript
// src/api/services/CityService.js
const CityService = {
    async findAll() {
        try {
            return await request({ url: Config.CITIES.ALL, method: "GET" });
        } catch {
            return [];
        }
    }
};
```

**Por qué está mal:**
- `request()` ya maneja errores
- `try/catch` que retorna `[]` oculta errores
- Cada servicio repite la misma estructura
- `buildAuthHeaders()` se llama en cada función

**Solución:**
```javascript
// src/api/client.js
export const api = {
  get: (url, token) => request({ url, method: 'GET', headers: buildAuthHeaders(token) }),
  post: (url, data, token) => request({ url, method: 'POST', data, headers: buildAuthHeaders(token) }),
  put: (url, data, token) => request({ url, method: 'PUT', data, headers: buildAuthHeaders(token) }),
  delete: (url, token) => request({ url, method: 'DELETE', headers: buildAuthHeaders(token) })
};

// Reemplazo directo:
// Antes: CityService.findAll()
// Después: api.get(Config.CITIES.ALL)
```

**Archivos a eliminar:**
- ✅ Mantener: `VehicleService`, `ReservationService` (tienen lógica de `buildParams`)
- ❌ Eliminar: `CityService`, `ProvinceService`, `SedeService`, `EmployeeService`, `UserService` (solo wrappers)

---

### 4. **Componentes que mezclan responsabilidades**

**Problema:** `VehicleDetailModal.jsx` (380 líneas):
- Fetch de categorías
- Fetch del vehículo
- Mapeo de IDs a nombres
- Formateo de precios
- Lógica de accesibilidad
- Rendering

**Separación correcta:**
```
VehicleDetailModal/
  ├── index.jsx              (solo UI + estructura)
  ├── useVehicleDetail.js    (fetch + transformaciones)
  └── formatters.js          (formatPrice, formatMileage)
```

**Otro caso:** `ReservationCreate.jsx`:
- Validación de formulario
- Estado de loading
- Navegación
- Normalización de fechas
- Llamadas API

Debería ser:
```
ReservationCreate/
  ├── index.jsx
  ├── useReservationForm.js  (validación + estado)
  └── validators.js          (reglas de negocio)
```

---

### 5. **Configuración dispersa y duplicada**

**Problema:** Labels, constantes y configuración en 5+ lugares:

```javascript
// src/components/common/catalog/VehicleListItem.jsx
const STATUS_LABELS_BY_ID = {
  1: { label: MESSAGES.AVAILABLE, class: 'status-available' },
  2: { label: MESSAGES.MAINTENANCE, class: 'status-maintenance' },
  // ...
};

// src/components/common/modal/VehicleDetailModal.jsx
const STATUS_LABELS_BY_ID = {
  1: MESSAGES.AVAILABLE,
  2: MESSAGES.MAINTENANCE,
  // ... DUPLICADO
};
```

**Solución:**
```javascript
// src/config/vehicleStatus.js
export const VEHICLE_STATUS = {
  AVAILABLE: { id: 1, labelKey: 'AVAILABLE', className: 'status-available' },
  MAINTENANCE: { id: 2, labelKey: 'MAINTENANCE', className: 'status-maintenance' },
  RENTED: { id: 3, labelKey: 'RENTED', className: 'status-rented' }
};

export const getStatusById = (id) => 
  Object.values(VEHICLE_STATUS).find(s => s.id === id);
```

---

## 🟡 PROBLEMAS MEDIOS

### 6. **Lógica de formularios repetida**

**Ubicaciones:**
- `Login.jsx` (120 líneas de form handling)
- `Register.jsx` (200 líneas de form handling)
- `ProfileClient.jsx` (250 líneas de form handling)
- `ProfileEmployee.jsx` (200 líneas de form handling)

**Patrón repetido:**
```javascript
const [formData, setFormData] = useState({...});
const [fieldErrors, setFieldErrors] = useState({});
const [statusMessage, setStatusMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');

const handleChange = (e) => {
  setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  if (fieldErrors[e.target.name]) {
    setFieldErrors(prev => ({...prev, [e.target.name]: null}));
  }
  // ... repetido 4 veces
};
```

**Solución:** Hook genérico
```javascript
// src/hooks/useFormState.js
export const useFormState = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    setStatus({ type: null, message: '' });
  };

  const validateForm = () => {
    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, status, handleChange, validateForm, setStatus };
};
```

---

### 7. **Constantes de mensajes mal usadas**

**Problema:** `MESSAGES` es un Proxy que llama `t()`:
```javascript
// src/constants/messages.js
export const MESSAGES = new Proxy({}, {
  get: (target, prop) => t(prop)
});
```

**Por qué está mal:**
- Oculta strings mágicos
- Imposible saber qué claves existen
- No hay autocompletado
- El Proxy no aporta nada

**Solución:**
```javascript
// Borra messages.js
// Usa directamente:
import { t } from '@/i18n';

// En lugar de:
<p>{MESSAGES.WELCOME_BACK}</p>

// Escribe:
<p>{t('WELCOME_BACK')}</p>
```

---

### 8. **Carpeta `learning/` en producción**

**Archivos:**
- `src/components/learning/noContext/*`
- `src/components/learning/withContext/*`
- `src/pages/public/ReactContextGuide.jsx`

**Qué hacer:** ELIMINAR todo. Son ejemplos educativos, no parte de la app.

---

## 🟢 SOBRE-ABSTRACCIÓN (menor prioridad)

### 9. **`buildVehicleFilterFields()` es demasiado flexible**

**Problema:** 100 líneas para construir un array de configuración que solo se usa en 2 lugares.

**Opciones:**
1. Simplificar a 2 arrays estáticos (uno público, uno empleado)
2. Mantenerlo si planeas más variantes

---

### 10. **Componentes wrapper sin valor**

**Ejemplos:**
- `Card.jsx` (3 líneas) → Usar `<div className="card">` directamente
- `LoadingSpinner.jsx` (8 líneas) → Inline
- `Button.jsx` (40 líneas) → Tiene sentido mantenerlo

---

## 📋 PLAN DE REFACTOR PRIORIZADO

### Fase 1: Eliminar código muerto (2 horas)
1. ✅ Borrar carpeta `learning/`
2. ✅ Borrar `ReactContextGuide.jsx`
3. ✅ Borrar `useApi.js`
4. ✅ Borrar `useHomePage.js`
5. ✅ Borrar servicios triviales (City, Province, Sede, Employee, User)

### Fase 2: Consolidar normalización (3 horas)
1. ✅ Crear `utils/entityNormalizers.js`
2. ✅ Reemplazar todas las funciones `normalizeEntity`, `resolveX`
3. ✅ Crear `config/vehicleStatus.js` y consolidar constantes

### Fase 3: Refactorizar formularios (4 horas)
1. ✅ Crear `useFormState.js`
2. ✅ Refactorizar Login, Register, ProfileClient, ProfileEmployee
3. ✅ Eliminar código duplicado de validación

### Fase 4: Simplificar servicios API (2 horas)
1. ✅ Crear `api/client.js` con helpers genéricos
2. ✅ Mantener solo servicios con lógica (Vehicle, Reservation)

### Fase 5: Limpiar componentes (4 horas)
1. ✅ Separar `VehicleDetailModal` en hook + UI
2. ✅ Mover formatters a `utils/formatters.js`
3. ✅ Extraer lógica de `ReservationCreate`

---

## 📊 MÉTRICAS DE MEJORA ESPERADAS

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas de código | ~8,500 | ~6,000 | -30% |
| Archivos | 119 | ~95 | -20% |
| Duplicación | Alta | Baja | 80% menos |
| Funciones `normalize*` | 15 | 3 | -80% |
| Hooks inútiles | 4 | 0 | -100% |
| Servicios triviales | 5 | 0 | -100% |

---

## ⚠️ LO QUE NO CAMBIARÉ

- ✅ Estructura de carpetas (está bien)
- ✅ React Router setup
- ✅ Context API (AuthContext, MessageContext)
- ✅ Sistema de i18n
- ✅ Axios client configuration
- ✅ CSS/estilos (fuera de scope)

---

## 🎯 RESULTADO FINAL

**Antes:** Código con mucha duplicación, abstracciones innecesarias y responsabilidades mezcladas.

**Después:** Código más limpio, mantenible y con menos líneas, siguiendo principios KISS (Keep It Simple, Stupid).

**Tiempo estimado total:** 15-20 horas de refactor real.
