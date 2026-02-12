import { MESSAGES } from '../../../constants';

function ClientListHeader({ onCreate }) {
  return (
    <header className="personal-space-header">
      <div>
        <h1>{MESSAGES.CLIENT_LIST_TITLE}</h1>
        <p className="personal-space-subtitle">{MESSAGES.CLIENT_LIST_SUBTITLE}</p>
      </div>
      <button
        type="button"
        className="vehicle-create-trigger"
        onClick={onCreate}
        aria-label={MESSAGES.ADD_USER}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
        </svg>
      </button>
    </header>
  );
}

export default ClientListHeader;
