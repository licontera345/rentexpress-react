import './Alert.css';

function Alert({ type = 'info', message, onClose }) {
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
