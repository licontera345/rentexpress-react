
// Componente Card que encapsula la interfaz y la lógica principal de esta sección.

function Card({ children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

export default Card;
