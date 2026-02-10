import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import { MESSAGES } from '../../../constants';
import useEmployeeClientListPage from '../../../hooks/useEmployeeClientListPage';

// Página del empleado para listado de clientes (próximamente). Prepara la sección de gestión de clientes.
function ClientList() {
  useEmployeeClientListPage();
  return (
    <PrivateLayout>
      {/* Encabezado del módulo de clientes */}
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.CLIENT_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.CLIENT_LIST_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card">
          <p>{MESSAGES.SECTION_COMING_SOON}</p>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default ClientList;
