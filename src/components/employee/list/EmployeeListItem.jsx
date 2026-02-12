import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { getHeadquartersNameLabel } from '../../../constants/headquartersLabels';

const toStatusClass = (activeStatus) => (activeStatus ? 'status-available' : 'status-rented');

function EmployeeListItem({ employee, onEdit, onDelete }) {
  const employeeId = employee.employeeId ?? employee.id;
  const fullName = [employee.firstName, employee.lastName1, employee.lastName2]
    .filter(Boolean)
    .join(' ')
    .trim();

  const roleName = employee.role?.roleName || MESSAGES.NOT_AVAILABLE_SHORT;
  const headquartersName = getHeadquartersNameLabel(employee.headquarters) || MESSAGES.NOT_AVAILABLE_SHORT;

  return (
    <article className="vehicle-list-item reservation-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{fullName || MESSAGES.NOT_AVAILABLE_SHORT}</h3>
          <p className="item-plate">@{employee.employeeName || MESSAGES.NOT_AVAILABLE_SHORT}</p>
        </div>
        <span className={`item-status ${toStatusClass(employee.activeStatus)}`}>
          {employee.activeStatus ? MESSAGES.ACTIVE : MESSAGES.INACTIVE}
        </span>
      </div>

      <div className="item-details">
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.EMPLOYEE_ID}</span>
          <span className="detail-value">{employeeId ?? MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.EMAIL}</span>
          <span className="detail-value">{employee.email || MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.PHONE}</span>
          <span className="detail-value">{employee.phone || MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.EMPLOYEE_POSITION_LABEL}</span>
          <span className="detail-value">{roleName}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.HEADQUARTERS_LABEL}</span>
          <span className="detail-value">{headquartersName}</span>
        </div>
      </div>

      <div className="item-actions">
        <div className="item-actions-group">
          <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(employeeId)}>
            {MESSAGES.EDIT}
          </Button>
        </div>
        <Button
          className="item-actions-delete"
          variant={BUTTON_VARIANTS.DANGER}
          size="small"
          onClick={() => onDelete(employeeId)}
        >
          {MESSAGES.DELETE}
        </Button>
      </div>
    </article>
  );
}

export default EmployeeListItem;
