
import { MESSAGES } from '../../../constants';

function LoadingSpinner({ message = MESSAGES.LOADING }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
