import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card } from '../../../components/index.js';

export default function ReservationCreate() {
  return (
    <PrivateLayout>
      <section className="page-reservation-create">
        <SectionHeader title="Nueva reserva" subtitle="Elige vehículo, fechas y sede" />
        <Card>
          <p>Formulario de nueva reserva: vehículo, sede recogida/devolución, fechas, estimación de precio.</p>
          <p className="text-muted">(Pantalla en construcción: reservationService.getEstimate, reservationService.create)</p>
        </Card>
      </section>
    </PrivateLayout>
  );
}
