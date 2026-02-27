# Fase 6: Estilos

Un solo CSS global para la app. Sin duplicar estilos por página.

## Archivo

- **styles/app.css** — Entry único. Importado en `main.jsx`.

## Secciones (en orden)

1. **BASE** — Variables CSS (`:root`, `[data-theme='dark']`), reset (`*`, html, body, #root), tipografía y controles (button, a, input, select, textarea), utilidades (`.sr-only`, `.truncate`), `.skip-link`, `prefers-reduced-motion`, scrollbar.
2. **LAYOUT** — `.public-layout`, `.private-layout`, `.main-content`, header (`.header`, `.header-container`, `.logo`, `.nav-link`, `.header-right`, `.theme-toggle`, `.auth-buttons`, `.auth-user*`), sidebar (`.sidebar-toggle`, `.sidebar`, `.sidebar-header`, `.sidebar-nav`, `.sidebar-link`, `.sidebar-overlay`), footer (`.footer`, `.footer-container`, `.footer-section`, `.footer-logo`, `.footer-bottom`, `.footer-links`, `.footer-link`, `.contact-item`, `.contact-detail`). Media para móvil (header nav oculto, footer en columna).
3. **COMPONENTS** — `.btn` (variantes y tamaños), `.card`, modal (`.modal-overlay`, `.modal-backdrop`, `.modal`, `.modal-header`, `.modal-body`, `.btn-close`), formulario (`.form-field`, `.form-label`, `.form-input`, `.form-input-wrapper`, `.form-error`, `.form-helper`, `.required`, range para FilterPanel), `.alert` (variantes), `.loading-spinner`, `.spinner`, `.empty-state`, `.badge`, `.pagination`, tabla CRUD (`.crud-table-wrap`, `.crud-table`, acciones), `.search-filters`, `.filter-form`, `.filter-grid`, `.filter-actions`, `.section-header`, `.list-results-panel`.
4. **PAGES** — Contenedores y cards de login/register/not-found (`.login-container`, `.login-card`, `.register-card`, etc.), `.personal-space`, `.dashboard-actions-grid`, `.form-actions`, `.text-muted`.

## Criterios

- Una sola hoja global; no CSS por página ni por componente.
- Clases reutilizables; las páginas usan las mismas clases (card, btn, form-field, etc.).
- Variables en `:root` y `[data-theme='dark']` para tema claro/oscuro.
- Modal del componente Modal: overlay + backdrop (cierre al clic) + dialog (`.modal`).

## Cómo probar

Con `src-new` como código activo (o renombrado a `src`), ejecutar la app y comprobar: home, login, register, listas employee/client, dashboard, footer, header, sidebar, modales, formularios y tablas con el aspecto esperado.
