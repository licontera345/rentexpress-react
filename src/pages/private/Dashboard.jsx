import { useState } from 'react';
import AuthService from '../../api/services/AuthService';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../../constants';
import './Dashboard.css';

function Dashboard() {
  const [user] = useState(() => AuthService.getCurrentUser());

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = ROUTES.HOME;
  };

  if (!user) {
    return <PrivateLayout>{MESSAGES.USER_NOT_FOUND}</PrivateLayout>;
  }

  return (
    <PrivateLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{MESSAGES.WELCOME}, {user?.name || 'Usuario'}</h1>
        </div>

        <div className="dashboard-grid">
          <Card className="dashboard-card">
            <h3>{MESSAGES.MY_RESERVATIONS}</h3>
            <p>{MESSAGES.VIEW_RESERVATIONS}</p>
            <Button 
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={() => window.location.href = ROUTES.MY_RESERVATIONS}
            >
              {MESSAGES.VIEW}
            </Button>
          </Card>

          <Card className="dashboard-card">
            <h3>{MESSAGES.MY_PROFILE}</h3>
            <p>{MESSAGES.UPDATE_PROFILE}</p>
            <Button 
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={() => window.location.href = ROUTES.PROFILE}
            >
              {MESSAGES.EDIT}
            </Button>
          </Card>

          <Card className="dashboard-card">
            <h3>{MESSAGES.MY_RESERVATIONS}</h3>
            <p>{MESSAGES.MANAGE_FLEET}</p>
            <Button 
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={() => window.location.href = ROUTES.MANAGE_VEHICLES}
            >
              {MESSAGES.MANAGE}
            </Button>
          </Card>
        </div>

        <div className="dashboard-actions">
          <Button variant={BUTTON_VARIANTS.SECONDARY} onClick={handleLogout}>
            {MESSAGES.LOGOUT}
          </Button>
        </div>
      </div>
    </PrivateLayout>
  );
}

export default Dashboard;