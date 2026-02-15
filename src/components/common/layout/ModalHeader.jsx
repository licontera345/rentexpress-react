import { MESSAGES } from '../../../constants';

/** Cabecera reutilizable de modal: título (con id para accesibilidad) y botón cerrar. */
function ModalHeader({ title, titleId, onClose }) {
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

export default ModalHeader;
