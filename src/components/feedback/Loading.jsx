/**
 * Estado de carga. Mensaje por props.
 */
export function Loading({ message = 'Cargando…' }) {
  return (
    <div className="loading-spinner" aria-busy="true" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default Loading;
