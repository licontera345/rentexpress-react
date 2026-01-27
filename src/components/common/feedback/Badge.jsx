import { BADGE_SIZES, BADGE_VARIANTS } from '../../../constants';

function Badge({ children, variant = BADGE_VARIANTS.DEFAULT, size = BADGE_SIZES.MEDIUM, className = '' }) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
