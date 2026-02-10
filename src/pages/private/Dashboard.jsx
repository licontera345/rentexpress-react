import PrivateLayout from '../../components/layout/private/PrivateLayout';
import { MESSAGES } from '../../constants';
import usePrivateDashboardPage from '../../hooks/usePrivateDashboardPage';

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

        <p className="personal-space-hint">{MESSAGES.DASHBOARD_MENU_HINT}</p>
      </section>
    </PrivateLayout>
  );
}

export default Dashboard;
