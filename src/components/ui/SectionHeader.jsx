/**
 * Cabecera de sección con título, subtítulo y slot para acciones (ej. botón Añadir).
 */
export function SectionHeader({ title, subtitle, children }) {
  return (
    <header className="section-header">
      <div>
        {title && <h1 className="section-header-title">{title}</h1>}
        {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="section-header-actions">{children}</div>}
    </header>
  );
}

export default SectionHeader;
