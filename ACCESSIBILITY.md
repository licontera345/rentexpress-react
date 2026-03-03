# Accesibilidad WCAG 2.1 nivel AA – RentExpress

Este documento recoge el estado de cumplimiento de los criterios WCAG AA en el sitio y las prácticas aplicadas en el proyecto.

---

## PERCEPTIBILIDAD

### Texto y color
- **Contraste texto normal ≥ 4.5:1**  
  Variables CSS `--color-text`, `--color-text-strong` y `--color-muted` en `app.css` usan tonos que cumplen 4.5:1 sobre el fondo. En tema claro, `--color-muted` está en `#475569` para cumplir en texto secundario.
- **Contraste texto grande ≥ 3:1**  
  Títulos y texto grande usan la misma paleta; el contraste cumple 3:1.
- **La información no depende solo del color**  
  Estados (éxito, error, advertencia) se indican con texto/iconos y estilos (borde, fondo), no solo color. Ver `FormField` (mensajes de error), badges y alertas.

### Texto alternativo
- **Imágenes informativas con alt adecuado**  
  Logo: `MESSAGES.LOGO_ALT`. Imágenes de vehículo: marca/modelo o `title`. Avatar de perfil: `alt=""` cuando es decorativo o `displayName` cuando aporta información. Ver `Header`, `Footer`, `VehicleImage`, `VehicleCard`, `VehicleDetailModal`, `ProfileHeader`.
- **Imágenes decorativas con `alt=""`**  
  Avatar en cabecera: `alt=""`. Iconos decorativos: `aria-hidden="true"`.

### Adaptabilidad
- **Contenido correcto sin CSS**  
  Estructura semántica (header, main, nav, footer, headings). El orden del DOM es lógico.
- **Encabezados h1–h6 jerárquicos**  
  Una sola `h1` por vista (p. ej. en Login, páginas de contenido). Uso coherente de `h2`, `h3` en secciones y listas.
- **Listas y tablas con etiquetas semánticas**  
  `<nav>`, listas de resultados, tablas del dashboard con `<table>`, `<th>`, `<td>` según corresponda.

### Multimedia
- **Vídeos con subtítulos**  
  No hay vídeos en la aplicación actual; si se añaden, deben incluir subtítulos sincronizados.
- **Audio en directo con subtítulos**  
  No aplicable en el estado actual.

---

## OPERABILIDAD

### Teclado
- **Uso solo con teclado**  
  Toda la interfaz es operable con teclado: enlaces, botones, formularios, `CustomSelect` (Enter, Espacio, Flechas, Escape, Home, End), modales (Escape para cerrar), atajos `?` para ayuda.
- **Foco visible**  
  Estilos globales `:focus-visible` con `--focus-ring` y `--focus-ring-offset`. Skip link, botones, enlaces y controles de formulario muestran anillo de foco. Ver `app.css` (`.skip-link:focus`, `.btn:focus-visible`, `.custom-select-trigger:focus-visible`).

### Tiempo y animaciones
- **Límites de tiempo ampliables o desactivables**  
  No hay límites de tiempo críticos en la interfaz (p. ej. sesión gestionada por backend; no hay countdown que bloquee contenido).
- **Sin destellos > 3 por segundo**  
  No se usan animaciones que destellen por encima de ese umbral. Se respeta `prefers-reduced-motion` en `app.css` (animaciones y transiciones reducidas).

### Navegación
- **Mecanismo para saltar al contenido**  
  Enlace “Saltar al contenido principal” en `PublicLayout` y `PrivateLayout` que lleva a `#main-content`. El `<main>` tiene `id="main-content"` y `tabIndex="-1"` para recibir el foco al activar el enlace.
- **Navegación consistente**  
  Cabecera y menú lateral (área privada) se mantienen en las mismas posiciones; misma estructura de navegación en todo el sitio.
- **Múltiples formas de encontrar contenido**  
  Navegación principal en cabecera, navegación en el pie de página (enlaces a Inicio, Catálogo, Contacto, Iniciar sesión, Registrarse), buscador en catálogo y rutas directas (login, registro, contacto, términos, etc.).
- **Encabezados y enlaces descriptivos**  
  Títulos de página y enlaces con texto claro (catálogo, perfil, cerrar sesión, etc.). Uso de `aria-label` en iconos sin texto (menú, tema, idioma, cerrar).

### Gestos y punteros
- **Gestos complejos con alternativa simple**  
  No se exigen gestos multipunto; acciones disponibles con un clic o teclado.
- **Área de destino suficiente**  
  Variable `--touch-target-min: 44px` en `app.css`; botones con `min-height: var(--touch-target-min)` para cumplir ~44×44 px (WCAG 2.5.5).

---

## COMPRENSIBILIDAD

### Idioma
- **Idioma principal del documento**  
  `index.html`: `<html lang="es">`. El atributo `lang` se actualiza con el idioma activo en `src/i18n/index.js` (`document.documentElement.lang` al iniciar y en `languageChanged`).
- **Cambios de idioma marcados**  
  El selector de idioma cambia `lang` en la raíz del documento; contenido traducido vía i18n sin fragmentos mixtos que requieran `lang` en nodos concretos por ahora.

### Previsibilidad
- **Sin cambios inesperados al enfocar/interactuar**  
  No se disparan envíos de formulario ni cambios de contexto solo al recibir foco; los envíos son por botón/enviar formulario.
- **Comportamiento consistente**  
  Botones, enlaces y controles (p. ej. `CustomSelect`) se comportan de forma coherente en todas las vistas.

### Formularios
- **Campos con etiquetas asociadas**  
  `FormField` usa `<label htmlFor={name}>` y `id` en el input; `CustomSelect` recibe `aria-label` cuando se usa desde `FormField` (label por nombre).
- **Errores explicados**  
  Mensajes de error en `role="alert"` y `aria-describedby` apuntando al id del error; `aria-invalid` en campo con error.
- **Sugerencias para corregir**  
  Donde aplique, los textos de error indican qué corregir (ej. formato de email, contraseña). Se pueden extender mensajes concretos por tipo de validación.
- **Instrucciones no solo por color o posición**  
  Errores y ayudas se comunican con texto; no se depende solo de color o de la posición en pantalla.

---

## ROBUSTEZ

### Código y compatibilidad
- **HTML válido**  
  Estructura correcta en `index.html`; JSX genera marcado válido. Conviene validar con linter/validador en build o CI.
- **Elementos personalizados accesibles**  
  Componentes interactivos exponen semántica: `CustomSelect` con `role="listbox"`, `aria-expanded`, `aria-haspopup`, `aria-activedescendant`, `aria-labelledby`; botones con `aria-label` cuando solo llevan icono.
- **Uso de ARIA correcto y necesario**  
  ARIA se usa donde el HTML nativo no basta: combobox/listbox, `aria-label` en iconos, `aria-expanded` en menú, `inert` en overlay del sidebar cuando corresponde.
- **Funcionamiento con lectores de pantalla**  
  Estructura semántica, roles y nombres accesibles permiten uso con lectores de pantalla; conviene pruebas con NVDA/JAWS/VoiceOver.

---

## Archivos clave

| Área            | Archivos |
|-----------------|----------|
| Estilos globales, contraste, foco, reduced-motion | `src/styles/app.css` |
| Idioma del documento | `index.html`, `src/i18n/index.js` |
| Skip link y main  | `src/components/layout/public/PublicLayout.jsx`, `src/components/layout/private/PrivateLayout.jsx` |
| Formularios y errores | `src/components/common/forms/FormField.jsx`, `FormPrimitives.jsx` |
| Select accesible | `src/components/common/forms/CustomSelect.jsx` |
| Imágenes y alt   | `src/components/vehicle/common/VehicleImage.jsx`, `Header`, `Footer`, `VehicleCard`, etc. |
| Navegación y botones | `Header.jsx`, `PrivateLayout.jsx` |

---

## Comprobaciones recomendadas

1. **Contraste**  
   Herramientas: DevTools (Lighthouse), Contrast Checker, o similar, en temas claro y oscuro.
2. **Teclado**  
   Navegar todo el flujo solo con Tab, Enter, Espacio y Escape.
3. **Lector de pantalla**  
   Pruebas con un lector (p. ej. NVDA en Windows) en login, catálogo, formularios y modales.
4. **Validación HTML**  
   Incluir en CI o pre-commit un validador (p. ej. eslint-plugin-jsx-a11y) y/o validador de HTML sobre el build.

En la configuración de ESLint se ha añadido `eslint-plugin-jsx-a11y` (reglas recomendadas). Algunas reglas estrictas están en modo `warn` para poder corregir progresivamente; se recomienda ir resolviendo los avisos de accesibilidad (click + teclado, roles ARIA, autofocus, etc.).
