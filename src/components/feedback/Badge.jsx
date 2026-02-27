import { BADGE_SIZES, BADGE_VARIANTS } from '../../constants/index.js';

export function Badge({
  children,
  variant = BADGE_VARIANTS.DEFAULT,
  size = BADGE_SIZES.MEDIUM,
  className = '',
}) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`.trim()}>
      {children}
    </span>
  );
}

export default Badge;
