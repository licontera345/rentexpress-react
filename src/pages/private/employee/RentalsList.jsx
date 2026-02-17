import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import SectionHeader from '../../../components/common/layout/SectionHeader';
import { MESSAGES } from '../../../constants';

// Página del empleado para gestionar alquileres (pendiente de implementación).
function RentalsList() {
  return (
    <PrivateLayout>
      <section className="personal-space">
        <SectionHeader
          title={MESSAGES.RENTALS_LIST_TITLE}
          subtitle={MESSAGES.RENTALS_LIST_SUBTITLE}
        />

        <Card className="personal-space-card">
          <p>{MESSAGES.SECTION_COMING_SOON}</p>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default RentalsList;
