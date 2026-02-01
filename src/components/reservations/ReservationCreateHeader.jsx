import { MESSAGES } from '../../constants';
import PageHeader from '../common/layout/PageHeader';

const ReservationCreateHeader = () => (
  <PageHeader
    title={MESSAGES.RESERVATION_CREATE_TITLE}
    subtitle={MESSAGES.RESERVATION_CREATE_SUBTITLE}
  />
);

export default ReservationCreateHeader;
