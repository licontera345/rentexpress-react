import { BADGE_SIZES, BADGE_VARIANTS } from '../../../constants';

// Componente Badge que define la interfaz y organiza la lógica de esta vista.

function Badge({ children, variant = BADGE_VARIANTS.DEFAULT, size = BADGE_SIZES.MEDIUM, className = '' }) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
