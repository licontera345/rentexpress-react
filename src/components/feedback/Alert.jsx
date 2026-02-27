import { ALERT_VARIANTS } from '../../constants/index.js';

/**
 * Alerta reutilizable. Mensaje y etiquetas por props (el padre usa t()).
 */
export function Alert({ type = ALERT_VARIANTS.INFO, message, onClose, closeLabel = 'Cerrar' }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="alert-content">
        <p className="alert-message">{message}</p>
      </div>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label={closeLabel}>
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;
