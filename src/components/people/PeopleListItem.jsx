import Button from '../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../constants';

const resolveId = (person, idField) => person?.[idField] ?? person?.id;

function PeopleListItem({
  person,
  idField,
  title,
  subtitle,
  details = [],
  onEdit,
  onDelete
}) {
  const itemId = resolveId(person, idField);

  return (
    <article className="vehicle-list-item reservation-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{title}</h3>
          <p className="item-plate">{subtitle}</p>
        </div>
      </div>

      <div className="reservation-meta-grid">
        {details.map((detail) => (
          <div key={detail.label} className="reservation-meta-item">
            <span>{detail.label}</span>
            <strong>{detail.value || MESSAGES.NOT_AVAILABLE_SHORT}</strong>
          </div>
        ))}
      </div>

      <div className="reservation-actions">
        <Button type="button" variant={BUTTON_VARIANTS.SECONDARY} onClick={() => onEdit(itemId)}>
          {MESSAGES.EDIT}
        </Button>
        <Button type="button" variant={BUTTON_VARIANTS.DANGER} onClick={() => onDelete(itemId)}>
          {MESSAGES.DELETE}
        </Button>
      </div>
    </article>
  );
}

export default PeopleListItem;
