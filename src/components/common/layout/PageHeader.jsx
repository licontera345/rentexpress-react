// Componente Page Header que encapsula la interfaz y la lógica principal de esta sección.

function PageHeader({ title, subtitle, greeting }) {
  return (
    <header className="personal-space-header">
      <div>
        {greeting && <p className="personal-space-greeting">{greeting}</p>}
        {title && <h1>{title}</h1>}
        {subtitle && <p className="personal-space-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}

export default PageHeader;
