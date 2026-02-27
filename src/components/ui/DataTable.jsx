import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ICON_SIZE = 18;

/**
 * Tabla de datos reutilizable. columns = [{ id, label, render?(row) }].
 * actions = { onView?, onEdit?, onDelete? }. getRowId(row) para key.
 */
export function DataTable({
  columns = [],
  data = [],
  getRowId,
  actions = {},
  actionsLabel = 'Acciones',
  viewLabel = 'Ver',
  editLabel = 'Editar',
  deleteLabel = 'Eliminar',
}) {
  const hasActions =
    typeof actions.onView === 'function' ||
    typeof actions.onEdit === 'function' ||
    typeof actions.onDelete === 'function';

  return (
    <div className="crud-table-wrap">
      <table className="crud-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id} scope="col">
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th scope="col" className="crud-table__actions-header">
                {actionsLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const rowId = typeof getRowId === 'function' ? getRowId(row) : index;
            return (
              <tr key={rowId}>
                {columns.map((col) => (
                  <td key={col.id} data-label={col.label}>
                    {typeof col.render === 'function' ? col.render(row) : row[col.id]}
                  </td>
                ))}
                {hasActions && (
                  <td className="crud-table__actions-cell" data-label={actionsLabel}>
                    <div className="crud-table__actions">
                      {typeof actions.onView === 'function' && (
                        <button
                          type="button"
                          className="crud-table__action-btn crud-table__action-btn--view"
                          onClick={() => actions.onView(row)}
                          aria-label={viewLabel}
                        >
                          <FiEye size={ICON_SIZE} aria-hidden />
                        </button>
                      )}
                      {typeof actions.onEdit === 'function' && (
                        <button
                          type="button"
                          className="crud-table__action-btn crud-table__action-btn--edit"
                          onClick={() => actions.onEdit(row)}
                          aria-label={editLabel}
                        >
                          <FiEdit2 size={ICON_SIZE} aria-hidden />
                        </button>
                      )}
                      {typeof actions.onDelete === 'function' && (
                        <button
                          type="button"
                          className="crud-table__action-btn crud-table__action-btn--delete"
                          onClick={() => actions.onDelete(row)}
                          aria-label={deleteLabel}
                        >
                          <FiTrash2 size={ICON_SIZE} aria-hidden />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
