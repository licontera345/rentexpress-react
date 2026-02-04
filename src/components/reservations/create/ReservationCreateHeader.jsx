import { MESSAGES } from '../../../constants';
import PageHeader from '../../common/layout/PageHeader';

// Componente ReservationCreateHeader que define la interfaz y organiza la lógica de esta vista.

const ReservationCreateHeader = () => (
  <PageHeader
    title={MESSAGES.RESERVATION_CREATE_TITLE}
    subtitle={MESSAGES.RESERVATION_CREATE_SUBTITLE}
  />
);

export default ReservationCreateHeader;
