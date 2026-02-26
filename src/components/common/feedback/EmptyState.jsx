
// Componente EmptyState que define la interfaz y organiza la lógica de esta vista.

function EmptyState({ title, description, icon, actionButton }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionButton && (
        <div className="empty-state-action">
          {actionButton}
        </div>
      )}
    </div>
  )
}

export default EmptyState;
