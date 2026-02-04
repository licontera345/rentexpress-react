import { MESSAGES } from '../../../constants';

// Componente VehicleFormHeader que define la interfaz y organiza la lógica de esta vista.

function VehicleFormHeader({ title, titleId, onClose }) {
  return (
    <div className="modal-header">
      <h2 id={titleId}>{title}</h2>
      <button
        className="btn-close"
        type="button"
        onClick={onClose}
        aria-label={MESSAGES.CLOSE}
      >
        ×
      </button>
    </div>
  );
}

export default VehicleFormHeader;
