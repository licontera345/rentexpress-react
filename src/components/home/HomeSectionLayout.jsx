export function HomeSectionHeader({ title, subtitle }) {
  return (
    <div className="home-section-header">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function HomeSection({ className = '', children }) {
  return (
    <div className={`home-section ${className}`.trim()}>
      {children}
    </div>
  );
}
