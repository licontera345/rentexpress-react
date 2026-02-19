import { FiUser, FiMail } from 'react-icons/fi';
import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function formatName(user) {
  const parts = [
    user?.firstName,
    user?.lastName1,
    user?.lastName2
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : (user?.username ?? MESSAGES.NOT_AVAILABLE_SHORT);
}

export default function ClientListItem({ user, onEdit, onDelete, onActivate }) {
  const userId = user?.userId ?? user?.id;
  const name = formatName(user);
  const email = user?.email ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const active = user?.activeStatus ?? user?.active;

  return (
    <article className="vehicle-list-item reservation-list-item client-list-item">
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
            {typeof onEdit === 'function' && userId && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(userId)}>
                {MESSAGES.EDIT}
              </Button>
            )}
            {typeof onActivate === 'function' && userId && !active && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onActivate(userId)}>
                {MESSAGES.ACTIVATE}
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
