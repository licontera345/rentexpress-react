import PrivateLayout from '../../components/layout/private/PrivateLayout';
import { useAuth } from '../../hooks/useAuth';
import { MESSAGES } from '../../constants/messages';

function Dashboard() {
  const { user, isEmployee } = useAuth();
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;

  const title = isEmployee
    ? MESSAGES.DASHBOARD_TITLE_EMPLOYEE
    : MESSAGES.DASHBOARD_TITLE_CUSTOMER;
  const subtitle = isEmployee
    ? MESSAGES.DASHBOARD_SUBTITLE_EMPLOYEE
    : MESSAGES.DASHBOARD_SUBTITLE_CUSTOMER;

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}, {displayName}</p>
            <h1>{title}</h1>
            <p className="personal-space-subtitle">{subtitle}</p>
          </div>
        </header>

        <p className="personal-space-hint">{MESSAGES.DASHBOARD_MENU_HINT}</p>
      </section>
    </PrivateLayout>
  );
}

export default Dashboard;
