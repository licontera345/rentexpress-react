import { MESSAGES } from '../../../constants';

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function ModalHeader({ title, titleId, onClose }) {
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
