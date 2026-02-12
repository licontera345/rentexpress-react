import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

const toStatusClass = (activeStatus) => (activeStatus ? 'status-available' : 'status-rented');

const resolveAddress = (client) => {
  if (Array.isArray(client.address)) return client.address[0] || {};
  return client.address || {};
};

function ClientListItem({ client, onEdit, onDelete }) {
  const userId = client.userId ?? client.id;
  const fullName = [client.firstName, client.lastName1, client.lastName2].filter(Boolean).join(' ').trim();
  const address = resolveAddress(client);
  const addressLabel = [address.street, address.number].filter(Boolean).join(' ').trim();

  return (
    <article className="vehicle-list-item reservation-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{fullName || MESSAGES.NOT_AVAILABLE_SHORT}</h3>
          <p className="item-plate">@{client.username || MESSAGES.NOT_AVAILABLE_SHORT}</p>
        </div>
        <span className={`item-status ${toStatusClass(client.activeStatus)}`}>
          {client.activeStatus ? MESSAGES.ACTIVE : MESSAGES.INACTIVE}
        </span>
      </div>

      <div className="item-details">
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.USER_ID}</span>
          <span className="detail-value">{userId ?? MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.EMAIL}</span>
          <span className="detail-value">{client.email || MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.PHONE}</span>
          <span className="detail-value">{client.phone || MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.BIRTH_DATE}</span>
          <span className="detail-value">{client.birthDate || MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.ADDRESS}</span>
          <span className="detail-value">{addressLabel || MESSAGES.NOT_AVAILABLE_SHORT}</span>
        </div>
      </div>

      <div className="item-actions">
        <div className="item-actions-group">
          <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(userId)}>
            {MESSAGES.EDIT}
          </Button>
        </div>
        <Button
          className="item-actions-delete"
          variant={BUTTON_VARIANTS.DANGER}
          size="small"
          onClick={() => onDelete(userId)}
        >
          {MESSAGES.DELETE}
        </Button>
      </div>
    </article>
  );
}

export default ClientListItem;
