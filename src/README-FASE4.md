# Fase 4: Componentes reutilizables

Componentes organizados en **feedback**, **ui**, **layout** y **auth**. Sin duplicar lógica; etiquetas y mensajes por props para poder usar i18n en el padre.

## Estructura

### feedback/
- **Alert** – Mensaje, tipo (success/error/info/warning), onClose, closeLabel.
- **Loading** – message.
- **Empty** – title, description, icon, action (slot).
- **Badge** – variant, size, children.

### ui/
- **Button** – variant, size, disabled, loading, onClick.
- **Card** – children, className.
- **Modal** – open, onClose, title, titleId, closeLabel, children. Cierra con Escape y clic en backdrop.
- **FormField** – label, name, type, value, onChange, error, helper, as (input|select|textarea), options.
- **Select** – name, value, onChange, options, placeholder (select nativo).
- **DataTable** – columns [{ id, label, render?(row) }], data, getRowId, actions { onView, onEdit, onDelete }, labels para acciones.
- **Pagination** – currentPage, totalPages, onPageChange, maxButtons, prevLabel, nextLabel.
- **FilterPanel** – fields [{ name, label, type, placeholder, options?, min, max }], values, onChange, onApply, onReset, title, applyLabel, resetLabel.
- **SectionHeader** – title, subtitle, children (acciones).
- **ListResultsPanel** – Unifica alerta de página, loading, error, empty, contenido y paginación. Props: title, subtitle, pageAlert, onCloseAlert, loading, loadingMessage, error, emptyTitle, emptyDescription, hasItems, children, pagination, onPageChange, maxButtons.

### layout/
- **PublicLayout** – Usa useHeaderProps() y renderiza skip-link, Header, main, Footer. Props opcionales para Footer y skipToContentLabel.
- **PrivateLayout** – Sidebar (menú), Header con toggle, main, Footer. menuItems opcional; si no se pasan se usan getShortcutsForRole con labelKey como label. Props: menuItems, skipToContentLabel, menuTitle, closeLabel, menuToggleLabel, más props para Footer.
- **Header** – Presentacional. Recibe props de useHeaderProps() + brandName, logoSrc, labels (signInLabel, signOutLabel, etc.), navigate.
- **Footer** – Presentacional. brandName, tagline, contactTitle, contactItems, links, copyrightTemplate.

### auth/
- **ProtectedRoute** – children, allowedRoles [], redirectTo. Usa useAuth(); redirige si no autenticado o rol no permitido.
- **ErrorBoundary** – children, title, description, retryLabel, homeLabel. Clase para componentDidCatch; botones Reintentar e Ir al inicio.

## Hooks relacionados

- **useHeaderProps()** – theme, toggleTheme, isAuthenticated, displayName, roleLabel, handleLogout, navigate. Para pasar a Header desde PublicLayout o PrivateLayout.

## Utils añadidos

- **utils/ui.js** – generatePageNumbers(currentPage, totalPages, maxButtons), buildAriaDescribedBy(...ids).
- **utils/date.js** – getCurrentYear().

## Uso

```js
import {
  Alert,
  Loading,
  Empty,
  Button,
  Card,
  Modal,
  FormField,
  DataTable,
  Pagination,
  FilterPanel,
  SectionHeader,
  ListResultsPanel,
  PublicLayout,
  PrivateLayout,
  ProtectedRoute,
  ErrorBoundary,
} from './components';
```

Las páginas componen estos componentes + hooks; no se repite el mismo JSX de loading/error/empty en cada lista gracias a ListResultsPanel.
