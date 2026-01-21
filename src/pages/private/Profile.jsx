import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Card from '../../components/common/layout/Card';
import { useAuth } from '../../context/AuthContext';
import { MESSAGES } from '../../constants';

function Profile() {
  const { user, role } = useAuth();
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  const roleLabel = role
    ? (role === 'employee' ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE)
    : MESSAGES.NOT_AVAILABLE;

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}, {displayName}</p>
            <h1>{MESSAGES.PROFILE_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.PROFILE_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card personal-space-card--profile">
          <h3>{MESSAGES.PROFILE_SUMMARY_TITLE}</h3>
          <p>{MESSAGES.PROFILE_SUMMARY_DESC}</p>
          <div className="personal-space-profile-info">
            <span>{MESSAGES.USERNAME}: <strong>{user?.username || MESSAGES.NOT_AVAILABLE}</strong></span>
            <span>{MESSAGES.ACCOUNT_TYPE}: <strong>{roleLabel}</strong></span>
          </div>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default Profile;
