import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import { MESSAGES } from '../../../constants';
import useEmployeeRentalsListPage from '../../../hooks/employee/useEmployeeRentalsListPage';

// Página del empleado para gestionar alquileres (pendiente de implementación). Reserva el espacio del módulo.
function RentalsList() {
  useEmployeeRentalsListPage();
  return (
    <PrivateLayout>
      {/* Encabezado del módulo de alquileres */}
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.RENTALS_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.RENTALS_LIST_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card">
          <p>{MESSAGES.SECTION_COMING_SOON}</p>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default RentalsList;
