import { MESSAGES } from '../../../../constants';

function VehicleListHeader({ onOpenInbox, onCreateVehicle }) {
  return (
    <header className="personal-space-header">
      <div>
        <h1>{MESSAGES.VEHICLE_LIST_TITLE}</h1>
        <p className="personal-space-subtitle">{MESSAGES.VEHICLE_LIST_SUBTITLE}</p>
      </div>
      <div className="vehicle-list-actions">
        <button
          type="button"
          className="vehicle-inbox-trigger"
          onClick={onOpenInbox}
          aria-label={MESSAGES.MAINTENANCE_INBOX_OPEN}
        >
          <span>{MESSAGES.MAINTENANCE_INBOX_OPEN}</span>
        </button>
        <button
          type="button"
          className="vehicle-create-trigger"
          onClick={onCreateVehicle}
          aria-label={MESSAGES.ADD_VEHICLE}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default VehicleListHeader;
