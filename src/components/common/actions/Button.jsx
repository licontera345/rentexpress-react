import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
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
