import { ALERT_VARIANTS } from '../../../constants';

// Componente Alert que encapsula la interfaz y la lógica principal de esta sección.

function Alert({ type = ALERT_VARIANTS.INFO, message, onClose }) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <p className="alert-message">{message}</p>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} type="button">×</button>
      )}
    </div>
  );
}

export default Alert;
