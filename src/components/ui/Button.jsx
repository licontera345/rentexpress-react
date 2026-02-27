import { BUTTON_SIZES, BUTTON_VARIANTS } from '../../constants/index.js';

/**
 * Botón reutilizable. variant, size, disabled, loading.
 */
export function Button({
  children,
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      data-loading={loading}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
