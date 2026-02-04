import { MESSAGES } from '../../../constants';
import PageHeader from '../../common/layout/PageHeader';

// Componente Reservation Create Header que encapsula la interfaz y la lógica principal de esta sección.

const ReservationCreateHeader = () => (
  <PageHeader
    title={MESSAGES.RESERVATION_CREATE_TITLE}
    subtitle={MESSAGES.RESERVATION_CREATE_SUBTITLE}
  />
);

export default ReservationCreateHeader;
