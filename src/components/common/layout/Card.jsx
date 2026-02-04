
// Componente Card que define la interfaz y organiza la lógica de esta vista.

function Card({ children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

export default Card;
