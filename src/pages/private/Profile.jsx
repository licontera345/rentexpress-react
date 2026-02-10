import PrivateLayout from '../../components/layout/private/PrivateLayout';
import ProfileHeader from '../../components/profile/headers/ProfileHeader';
import ProfileSummaryCard from '../../components/profile/cards/ProfileSummaryCard';
import ProfileEmployee from './profile/ProfileEmployee';
import ProfileClient from './profile/ProfileClient';
import usePrivateProfilePage from '../../hooks/private/usePrivateProfilePage';
import './profile/ProfilePage.css';

function Profile() {
  const { state } = usePrivateProfilePage();

  return (
    <PrivateLayout>
      <section className="personal-space profilePage">
        <ProfileHeader
          displayName={state.displayName}
          roleLabel={state.roleLabel}
          headquartersName={state.employeeHeadquartersName}
        />
        <ProfileSummaryCard
          user={state.user}
          roleLabel={state.roleLabel}
          isEmployee={state.isEmployee}
          employeeRoleName={state.employeeRoleName}
          employeeHeadquartersName={state.employeeHeadquartersName}
        />
        {state.isEmployee ? <ProfileEmployee /> : <ProfileClient />}
      </section>
    </PrivateLayout>
  );
}

export default Profile;
