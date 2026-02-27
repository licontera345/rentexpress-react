function SectionHeader({ title, subtitle, children }) {
  return (
    <header className="personal-space-header">
      <div>
        {title && <h1>{title}</h1>}
        {subtitle && <p className="personal-space-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="vehicle-list-actions">{children}</div>}
    </header>
  );
}

export default SectionHeader;
