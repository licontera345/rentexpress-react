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

/**
 * Estado activo: 1/true = activo, 0/false = inactivo.
 * OpenAPI EmployeeDTO: activeStatus (boolean) en la raíz; backend puede serializar tinyint como 0/1.
 */
const isActive = (value) => {
  if (value === false || value === 0 || value === '0') return false;
  return Number(value) === 1 || value === true || value === '1';
};

/** Lee activeStatus según package-rentexpress.json (EmployeeDTO) y fallbacks por si la API devuelve user o snake_case. */
function getActiveStatus(employee) {
  const u = employee?.user;
  return (
    u?.activeStatus ?? u?.active_status ?? u?.active ??
    employee?.activeStatus ?? employee?.active_status ?? employee?.active
  );
}

export default function EmployeeListItem({ employee, onEdit, onDelete }) {
  const employeeId = employee?.employeeId ?? employee?.id;
  const name = formatName(employee);
  const email = employee?.email ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const active = isActive(getActiveStatus(employee));
  const statusModifier = active ? 'status-active' : 'status-inactive';

  const roleName = employee?.role?.roleName ?? employee?.roleName ?? null;
  const headquartersName = employee?.headquarters?.[0]?.name ?? employee?.headquartersName ?? null;

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

      {(typeof onEdit === 'function' || typeof onDelete === 'function') && (
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

