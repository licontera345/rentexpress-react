import { FiUser, FiMail, FiMapPin } from 'react-icons/fi';
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

const isActive = (value) => {
  if (value === false || value === 0 || value === '0') return false;
  return value === true || Number(value) === 1 || value === '1';
};

function getActiveStatus(employee) {
  return employee?.activeStatus;
}

export default function EmployeeListItem({ employee, onEdit, onDelete }) {
  const employeeId = employee?.id;
  const name = formatName(employee);
  const email = employee?.email || MESSAGES.NOT_AVAILABLE_SHORT;
  const active = isActive(getActiveStatus(employee));
  const statusModifier = active ? 'status-active' : 'status-inactive';
  const hasActions = [onEdit, onDelete].some((fn) => typeof fn === 'function');

  const roleName = employee?.role?.roleName ?? null;
  const headquartersName = employee?.headquarters?.name ?? null;

  return (
    <article className={`vehicle-list-item reservation-list-item employee-list-item reservation-list-item--${statusModifier}`}>
      <div className="reservation-list-item__header">
        <div className="reservation-list-item__info">
          <h3 className="reservation-list-item__title">{name}</h3>
        </div>
        <span className={`reservation-list-item__status ${active ? 'status-active' : 'status-inactive'}`}>
          {active ? MESSAGES.ACTIVE : MESSAGES.INACTIVE}
        </span>
      </div>

      <div className="reservation-list-item__details">
        <div className="reservation-list-item__detail">
          <span className="reservation-list-item__label">
            <FiMail aria-hidden />
            {MESSAGES.EMAIL}
          </span>
          <span className="reservation-list-item__value">{email}</span>
        </div>
        {roleName && (
          <div className="reservation-list-item__detail">
            <span className="reservation-list-item__label">
              <FiUser aria-hidden />
              {MESSAGES.EMPLOYEE_POSITION_LABEL}
            </span>
            <span className="reservation-list-item__value">{roleName}</span>
          </div>
        )}
        {headquartersName && (
          <div className="reservation-list-item__detail">
            <span className="reservation-list-item__label">
              <FiMapPin aria-hidden />
              {MESSAGES.HEADQUARTERS_LABEL}
            </span>
            <span className="reservation-list-item__value">{headquartersName}</span>
          </div>
        )}
      </div>

      {hasActions && (
        <div className="reservation-list-item__actions">
          <div className="reservation-list-item__actions-group">
            {typeof onEdit === 'function' && employeeId && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(employeeId)}>
                {MESSAGES.EDIT}
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

