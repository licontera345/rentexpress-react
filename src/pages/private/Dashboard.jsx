import { Link } from 'react-router-dom';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Card from '../../components/common/layout/Card';
import { MESSAGES } from '../../constants';
import usePrivateDashboardPage from '../../hooks/private/usePrivateDashboardPage';

function Dashboard() {
  const { state } = usePrivateDashboardPage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}, {state.displayName}</p>
            <h1>{state.title}</h1>
            <p className="personal-space-subtitle">{state.subtitle}</p>
          </div>
        </header>

        <section>
          <h2>{MESSAGES.DASHBOARD_QUICK_ACTIONS}</h2>
          <div className="dashboard-actions-grid">
            {state.quickActions.map((action) => (
              <Card className="personal-space-card" key={action.route}>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <Link className="btn btn-primary btn-small personal-space-card-link" to={action.route}>
                  {action.cta}
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <p className="personal-space-hint">{MESSAGES.DASHBOARD_MENU_HINT}</p>
      </section>
    </PrivateLayout>
  );
}

export default Dashboard;
