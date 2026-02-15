/**
 * Sección reutilizable de formulario: título + contenedor en grid.
 * Usado en formularios de vehículo y otros que repiten la misma estructura.
 */
function FormSection({ title, children }) {
  return (
    <section className="vehicle-create-section">
      <div className="vehicle-create-section-header">
        <h3>{title}</h3>
      </div>
      <div className="vehicle-create-grid">
        {children}
      </div>
    </section>
  );
}

export default FormSection;
