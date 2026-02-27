import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card } from '../../../components/index.js';

export default function PickupVerification() {
  return (
    <PrivateLayout>
      <section className="page-pickup">
        <SectionHeader title="Verificación de recogida" subtitle="Validar código de recogida" />
        <Card>
          <p>Introduce el código de recogida para validar la entrega del vehículo.</p>
          <p className="text-muted">(Pantalla en construcción: reservationService.verifyCode)</p>
        </Card>
      </section>
    </PrivateLayout>
  );
}
