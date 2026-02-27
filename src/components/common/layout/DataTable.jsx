import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MESSAGES } from '../../../constants';

const ICON_SIZE = 18;

function DataTable({ columns = [], data = [], getRowId, actions = {} }) {
  const hasActions =
    typeof actions?.onView === 'function' ||
    typeof actions?.onEdit === 'function' ||
    typeof actions?.onDelete === 'function';

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
                {MESSAGES.ACTIONS}
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
                  <td className="crud-table__actions-cell" data-label={MESSAGES.ACTIONS}>
                    <div className="crud-table__actions">
                      {typeof actions.onView === 'function' && (
                        <button
                          type="button"
                          className="crud-table__action-btn crud-table__action-btn--view"
                          onClick={() => actions.onView(row)}
                          aria-label={MESSAGES.VIEW}
                        >
                          <FiEye size={ICON_SIZE} aria-hidden />
                        </button>
                      )}
                      {typeof actions.onEdit === 'function' && (
                        <button
                          type="button"
                          className="crud-table__action-btn crud-table__action-btn--edit"
                          onClick={() => actions.onEdit(row)}
                          aria-label={MESSAGES.EDIT}
                        >
                          <FiEdit2 size={ICON_SIZE} color="#fff" aria-hidden />
                        </button>
                      )}
                      {typeof actions.onDelete === 'function' && (
                        <button
                          type="button"
                          className="crud-table__action-btn crud-table__action-btn--delete"
                          onClick={() => actions.onDelete(row)}
                          aria-label={MESSAGES.DELETE}
                        >
                          <FiTrash2 size={ICON_SIZE} color="#fff" aria-hidden />
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
