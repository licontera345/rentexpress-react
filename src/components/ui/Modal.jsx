import { useEffect } from 'react';

/**
 * Modal reutilizable: overlay + contenido + cabecera con título y cerrar.
 * Cierra con onClose (botón o overlay). closeLabel para accesibilidad.
 */
export function Modal({
  open,
  onClose,
  title,
  titleId = 'modal-title',
  closeLabel = 'Cerrar',
  children,
  className = '',
}) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="modal-backdrop"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div className={`modal ${className}`.trim()}>
        <div className="modal-header">
          {title && <h2 id={titleId}>{title}</h2>}
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
