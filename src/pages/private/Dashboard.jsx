import { Link } from 'react-router-dom';
import { PrivateLayout } from '../../components/index.js';
import { SectionHeader, Card } from '../../components/index.js';
import { useAuth } from '../../hooks/index.js';
import { ROUTES, USER_ROLES } from '../../constants/index.js';

export default function Dashboard() {
  const { user, isEmployee } = useAuth();
  const displayName = user?.firstName ?? user?.username ?? 'Usuario';

  if (isEmployee) {
    return (
      <PrivateLayout>
        <section className="page-dashboard">
          <SectionHeader
            title="Panel de empleado"
            subtitle={`Bienvenido, ${displayName}`}
          />
          <div className="dashboard-placeholder card">
            <p>Estadísticas y gráficos (recharts) se pueden añadir aquí.</p>
            <p className="text-muted">Usa statisticsService desde la API.</p>
          </div>
        </section>
      </PrivateLayout>
    );
  }

  const quickActions = [
    { route: ROUTES.RESERVATION_CREATE, title: 'Nueva reserva', description: 'Reservar un vehículo', cta: 'Reservar' },
    { route: ROUTES.MY_RESERVATIONS, title: 'Mis reservas', description: 'Ver y gestionar reservas', cta: 'Ver' },
    { route: ROUTES.MY_RENTALS, title: 'Mis alquileres', description: 'Ver alquileres activos', cta: 'Ver' },
  ];

  return (
    <PrivateLayout>
      <section className="page-dashboard">
        <SectionHeader
          title="Mi espacio"
          subtitle={`Bienvenido, ${displayName}`}
        />
        <h2>Accesos rápidos</h2>
        <div className="dashboard-actions-grid">
          {quickActions.map((action) => (
            <Card key={action.route} className="dashboard-card">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <Link to={action.route} className="btn btn-primary btn-small">
                {action.cta}
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </PrivateLayout>
  );
}
