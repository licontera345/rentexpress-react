
// Componente Button que encapsula la interfaz y la lógica principal de esta sección.

import { BUTTON_SIZES, BUTTON_VARIANTS } from '../../../constants';

function Button({ 
  children, 
  variant = BUTTON_VARIANTS.PRIMARY, 
  size = BUTTON_SIZES.MEDIUM,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) {
  return (
    <button 
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      data-loading={loading}
    >
      {children}
    </button>
  );
}

export default Button;
