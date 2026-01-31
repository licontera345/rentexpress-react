# RentExpress - Reglas de Arquitectura para Cursor AI

## 🎯 Principio fundamental
**KISS sobre DRY**: Prefiere código simple y directo sobre abstracciones prematuras.
**Regla de 3**: Solo abstrae cuando veas el MISMO patrón repetido 3+ veces.

---

## ❌ PROHIBIDO: Anti-patrones detectados

### 1. NO crear hooks falsos
```javascript
// ❌ MAL - Hook que no usa React
export const useApi = () => {
  return { fetchData: async () => {} }
}

// ✅ BIEN - Función normal
export const fetchData = async () => {}
```

**Regla**: Un hook DEBE usar al menos un hook de React (useState, useEffect, useContext, etc.)

### 2. NO duplicar normalización de datos
```javascript
// ❌ MAL - Función duplicada en 15 archivos
const normalizeVehicle = (v) => ({
  id: v?.id || v?._id,
  name: v?.name || v?.modelo
})

// ✅ BIEN - Importar desde utils/entityNormalizers.js
import { normalize } from '@/utils/entityNormalizers'
const vehicle = normalize(rawVehicle)
```

**Regla**: Si escribes `v?.id || v?._id` en más de 1 archivo, crea una utilidad compartida.

### 3. NO crear servicios triviales
```javascript
// ❌ MAL - Wrapper inútil
export class CityService {
  static async getAll() {
    try {
      const res = await api.get('/cities')
      return res.data
    } catch {
      return []
    }
  }
}

// ✅ BIEN - Usa el cliente directo
const cities = await apiClient.get('/cities')
```

**Regla**: Un servicio DEBE tener lógica (buildParams, transformaciones, caché). Si solo hace try/catch, NO lo crees.

### 4. NO usar Proxy para constantes
```javascript
// ❌ MAL - Proxy oculta los valores
const MESSAGES = new Proxy({}, {
  get: (_, key) => key
})

// ✅ BIEN - Importa i18n directamente
import { t } from '@/i18n'
const message = t('user.login.success')
```

**Regla**: Las constantes deben ser explícitas y autocomplete-friendly.

### 5. NO mezclar responsabilidades en componentes
```javascript
// ❌ MAL - 1 componente hace: fetch + mapeo + validación + UI
const VehicleDetail = () => {
  const [data, setData] = useState()
  useEffect(() => { /* fetch */ }, [])
  const normalized = normalizeVehicle(data) // mapeo
  const validate = () => { /* validación */ }
  return <div>{/* 200 líneas JSX */}</div>
}

// ✅ BIEN - Separar en capas
// useVehicleDetail.js (hook - data fetching)
// formatters.js (utilidades - mapeo)
// VehicleDetail.jsx (componente - solo UI)
```

**Regla**: Si un componente supera 150 líneas, divídelo en:
- `ComponentName/index.jsx` - UI pura
- `ComponentName/useComponentName.js` - Lógica/estado
- `ComponentName/formatters.js` - Transformaciones (si aplica)

### 6. NO duplicar configuraciones
```javascript
// ❌ MAL - STATUS_LABELS definido en 3 archivos
const STATUS_LABELS = { disponible: 'Disponible', ... }

// ✅ BIEN - Consolidar en config/
import { VEHICLE_STATUS } from '@/config/vehicleStatus'
```

**Regla**: Constantes de dominio van en `src/config/`. Si aparece 2+ veces, consolídala.

### 7. NO repetir lógica de formularios
```javascript
// ❌ MAL - Mismo patrón en 5 componentes
const [formData, setFormData] = useState({})
const [errors, setErrors] = useState({})
const handleChange = (e) => { /* ... */ }

// ✅ BIEN - Hook reutilizable
const { formData, errors, handleChange, validate } = useFormState(initialData)
```

**Regla**: Si copias/pegas código de formulario, crea `useFormState` genérico.

---

## ✅ BUENAS PRÁCTICAS

### Estructura de carpetas
```
src/
  components/
    [feature]/           # Por funcionalidad
      ComponentName/
        index.jsx        # UI
        useHook.js       # Lógica (opcional)
        styles.css       # Estilos (opcional)
  utils/                 # Funciones puras, sin React
    entityNormalizers.js # normalize(), getId(), getName()
    formatters.js        # formatDate(), formatCurrency()
  hooks/                 # Solo hooks REALES que usan React
    useAuth.js          ✅ usa useContext + useState
    useFormState.js     ✅ usa useState
  api/
    client.js           # Cliente Axios base
    services/           # Solo si tienen lógica compleja
      VehicleService.js ✅ buildParams, caché
  config/               # Constantes de dominio
    vehicleStatus.js
    headquartersLabels.js
```

### Cuándo crear abstracciones

| Situación | Acción |
|-----------|--------|
| Código repetido 2 veces | ⏸️ Espera |
| Código repetido 3+ veces | ✅ Abstrae |
| Componente > 150 líneas | ✅ Divide |
| Servicio sin lógica | ❌ Usa cliente directo |
| Hook sin hooks de React | ❌ Hazlo función normal |
| Constante en 2+ archivos | ✅ Mueve a config/ |

### Checklist antes de crear archivos

- [ ] ¿Este hook usa al menos un hook de React?
- [ ] ¿Este servicio tiene lógica más allá de try/catch?
- [ ] ¿Esta utilidad se usa en 3+ lugares?
- [ ] ¿Este componente tiene una sola responsabilidad?
- [ ] ¿Estas constantes están consolidadas?

---

## 🔧 Comandos útiles

Cuando Cursor sugiera código, pregúntale:
- "¿Esto viola alguna regla de .cursorrules?"
- "¿Puedo simplificar esto sin abstraer?"
- "¿Ya existe una utilidad similar en el proyecto?"

---

## 📊 Métricas objetivo

- Componentes: < 150 líneas promedio
- Hooks: Solo si usan React hooks
- Servicios: Solo con lógica de negocio
- Duplicación: < 5% del código
- Archivos: Mínimo necesario

---

## 🚨 Señales de alerta

Si escribes esto, DETENTE:

```javascript
// 🚨 "Estoy duplicando código de otro archivo"
// 🚨 "Este hook solo retorna una función"
// 🚨 "Este servicio solo hace try/catch"
// 🚨 "Copié/pegué esta función"
// 🚨 "Este componente tiene 300 líneas"
```

**Acción**: Revisa las reglas arriba antes de continuar.

---

## 📝 Notas finales

- **Simplicidad > Elegancia**: Prefiere código obvio sobre código "clever"
- **Funciones > Clases**: Usa funciones puras cuando sea posible
- **Importaciones explícitas**: Evita barrels, wildcards y re-exports
- **Coloca código cerca de donde se usa**: No prematuramente lo conviertas en "compartido"

**Pregunta clave**: "Si elimino esta abstracción, ¿el código sería más simple?"
Si la respuesta es SÍ, elimínala.
