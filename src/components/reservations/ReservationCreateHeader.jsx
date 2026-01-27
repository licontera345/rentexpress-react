import { MESSAGES } from '../../constants';

const ReservationCreateHeader = () => (
  <header className="personal-space-header">
    <div>
      <h1>{MESSAGES.RESERVATION_CREATE_TITLE}</h1>
      <p className="personal-space-subtitle">{MESSAGES.RESERVATION_CREATE_SUBTITLE}</p>
    </div>
  </header>
);

export default ReservationCreateHeader;
