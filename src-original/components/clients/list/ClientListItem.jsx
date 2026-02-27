import { FiUser, FiMail } from 'react-icons/fi';
import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function formatName(user) {
  const parts = [
    user?.firstName,
    user?.lastName1,
    user?.lastName2
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : (user?.username || MESSAGES.NOT_AVAILABLE_SHORT);
}

const isActive = (value) => Number(value) === 1 || value === true || value === '1';

export default function ClientListItem({ user, onEdit, onDelete }) {
  const userId = user?.userId;
  const name = formatName(user);
  const email = user?.email || MESSAGES.NOT_AVAILABLE_SHORT;
  const active = isActive(user?.activeStatus);
  const statusModifier = active ? 'status-active' : 'status-inactive';
  const hasActions = [onEdit, onDelete].some((fn) => typeof fn === 'function');

  return (
    <article className={`vehicle-list-item reservation-list-item client-list-item reservation-list-item--${statusModifier}`}>
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
      </div>

      {hasActions && (
        <div className="reservation-list-item__actions">
          <div className="reservation-list-item__actions-group">
            {typeof onEdit === 'function' && userId && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(userId)}>
                {MESSAGES.EDIT}
              </Button>
            )}
          </div>
          {typeof onDelete === 'function' && userId && (
            <Button
              className="reservation-list-item__actions-delete"
              variant={BUTTON_VARIANTS.DANGER}
              size="small"
              onClick={() => onDelete(userId)}
            >
              {MESSAGES.DELETE}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
