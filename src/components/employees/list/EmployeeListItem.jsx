import { FiUser, FiMail } from 'react-icons/fi';
import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function formatName(employee) {
  const parts = [
    employee?.firstName,
    employee?.lastName1,
    employee?.lastName2
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : MESSAGES.NOT_AVAILABLE_SHORT;
}

export default function EmployeeListItem({ employee, onEdit, onDelete, onActivate }) {
  const employeeId = employee?.employeeId ?? employee?.id;
  const name = formatName(employee);
  const email = employee?.email ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const active = employee?.activeStatus ?? employee?.active;

  return (
    <article className="vehicle-list-item reservation-list-item employee-list-item">
      <div className="reservation-list-item__header">
        <div className="reservation-list-item__info">
          <h3 className="reservation-list-item__title">
            <FiUser className="reservation-list-item__icon" aria-hidden />
            {name}
          </h3>
          <p className="reservation-list-item__vehicle">
            <FiMail className="reservation-list-item__icon" aria-hidden />
            {email}
          </p>
        </div>
        <span className={`reservation-list-item__status ${active ? 'active' : 'inactive'}`}>
          {active ? MESSAGES.ACTIVE : MESSAGES.INACTIVE}
        </span>
      </div>

      {(typeof onEdit === 'function' || typeof onDelete === 'function' || typeof onActivate === 'function') && (
        <div className="reservation-list-item__actions">
          <div className="reservation-list-item__actions-group">
            {typeof onEdit === 'function' && employeeId && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(employeeId)}>
                {MESSAGES.EDIT}
              </Button>
            )}
            {typeof onActivate === 'function' && employeeId && !active && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onActivate(employeeId)}>
                {MESSAGES.ACTIVATE}
              </Button>
            )}
          </div>
          {typeof onDelete === 'function' && employeeId && (
            <Button
              className="reservation-list-item__actions-delete"
              variant={BUTTON_VARIANTS.DANGER}
              size="small"
              onClick={() => onDelete(employeeId)}
            >
              {MESSAGES.DELETE}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

