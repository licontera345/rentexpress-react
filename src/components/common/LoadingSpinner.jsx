import './LoadingSpinner.css';

function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
