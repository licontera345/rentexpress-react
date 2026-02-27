
import { MESSAGES } from '../../../constants';

// Componente LoadingSpinner que define la interfaz y organiza la lógica de esta vista.

function LoadingSpinner({ message = MESSAGES.LOADING }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
