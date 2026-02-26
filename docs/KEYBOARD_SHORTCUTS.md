# Atajos de teclado — RentExpress

Documentación de las acciones rápidas por teclado en el área privada de la aplicación (Dashboard y secciones de gestión).

---

## Reglas generales

- **Los atajos solo se activan cuando el foco NO está en un campo de texto** (input, textarea, select). Así se evita interferir al escribir.
- **Secuencia "g" + letra**: primero se pulsa `g`, luego la letra de destino. Si no pulsas la segunda tecla en ~1,5 s, se cancela.
- La **ayuda de atajos** se puede abrir en cualquier momento desde el menú lateral («? Atajos de teclado») o con el atajo `?`.

---

## Atajos globales (todos los usuarios autenticados)

| Atajo | Acción |
|-------|--------|
| `g` + `d` | Ir al **Dashboard** |
| `g` + `p` | Ir a **Perfil** |
| `?` o `Shift + /` | Abrir / cerrar **Ayuda de atajos** |
| `Esc` | Cerrar la ayuda o cancelar la secuencia «g» |

---

## Formularios de filtros (listados y catálogo)

En cualquier panel de filtros (empleados, clientes, vehículos, reservas, alquileres, catálogo):

| Atajo | Acción |
|-------|--------|
| **Enter** | Aplicar filtros (equivale a pulsar «Aplicar filtros»). Funciona desde cualquier campo del filtro (texto, select, etc.). |

No hace falta bajar hasta el botón: al terminar de escribir o de elegir un valor, pulsa **Enter** para aplicar.

---

## Atajos para empleados

Además de los globales:

| Atajo | Acción |
|-------|--------|
| `g` + `e` | Lista de **empleados** |
| `g` + `c` | Lista de **clientes** |
| `g` + `v` | Lista de **vehículos** |
| `g` + `r` | Lista de **reservas** |
| `g` + `a` | Lista de **alquileres** |
| `g` + `u` | **Verificación de recogida** (pickup) |

---

## Atajos para clientes

Además de los globales:

| Atajo | Acción |
|-------|--------|
| `g` + `n` | **Nueva reserva** |
| `g` + `r` | **Mis reservas** |
| `g` + `a` | **Mis alquileres** |

---

## Dónde está implementado

| Qué | Dónde |
|-----|--------|
| Definición de atajos y rutas | `src/constants/shortcuts.js` |
| Lógica de teclado global | `src/hooks/useKeyboardShortcuts.js` |
| Modal de ayuda | `src/components/common/KeyboardShortcutsHelp.jsx` |
| Estilos del modal | `src/styles/shortcuts-help.css` |
| Integración en layout | `src/components/layout/private/PrivateLayout.jsx` |
| Panel de filtros (Enter = aplicar) | `src/components/common/filters/FilterPanel.jsx` |
| CustomSelect en filtros (Enter envía formulario) | `src/components/common/forms/CustomSelect.jsx` (prop `submitOnEnterWhenClosed`) |

Para **añadir un nuevo atajo**:

1. Añadir la entrada en `SHORTCUTS_COMMON`, `SHORTCUTS_EMPLOYEE` o `SHORTCUTS_CUSTOMER` en `shortcuts.js` (key, route, labelKey de traducción).
2. Actualizar esta documentación con la nueva fila en la tabla correspondiente.

---

## Posibles extensiones (ideas para más adelante)

- **Ctrl + K**: paleta de comandos / búsqueda rápida.
- **Ctrl + S**: guardar formulario (en pantallas de edición).
- **Enter** / **Esc** en modales: confirmar / cerrar.
- Atajos por página (por ejemplo en listados: `n` = nuevo, `/` = focus en búsqueda).

Si se implementan, conviene añadirlos aquí y en el modal de ayuda (`KeyboardShortcutsHelp`).
