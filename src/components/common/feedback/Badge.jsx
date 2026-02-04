import { BADGE_SIZES, BADGE_VARIANTS } from '../../../constants';

// Componente Badge que encapsula la interfaz y la lógica principal de esta sección.

function Badge({ children, variant = BADGE_VARIANTS.DEFAULT, size = BADGE_SIZES.MEDIUM, className = '' }) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
