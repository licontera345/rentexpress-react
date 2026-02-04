import PropTypes from 'prop-types';
import { MESSAGES } from '../../../constants';

// Componente ReservationsListHeader que define la interfaz y organiza la lógica de esta vista.

function ReservationsListHeader({ onCreate }) {
  return (
    <header className="personal-space-header">
      <div>
        <h1>{MESSAGES.RESERVATIONS_LIST_TITLE}</h1>
        <p className="personal-space-subtitle">{MESSAGES.RESERVATIONS_LIST_SUBTITLE}</p>
      </div>
      <button
        type="button"
        className="vehicle-create-trigger"
        onClick={onCreate}
        aria-label={MESSAGES.ADD_RESERVATION}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
        </svg>
      </button>
    </header>
  );
}

ReservationsListHeader.propTypes = {
  onCreate: PropTypes.func.isRequired
};

export default ReservationsListHeader;
