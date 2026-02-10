import PrivateLayout from '../../components/layout/private/PrivateLayout';
import ProfileHeader from '../../components/profile/headers/ProfileHeader';
import ProfileSummaryCard from '../../components/profile/cards/ProfileSummaryCard';
import ProfileEmployee from './profile/ProfileEmployee';
import ProfileClient from './profile/ProfileClient';
import usePrivateProfilePage from '../../hooks/usePrivateProfilePage';

function Profile() {
  const {
    user,
    isEmployee,
    displayName,
    roleLabel,
    employeeRoleName,
    employeeHeadquartersName
  } = usePrivateProfilePage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <ProfileHeader displayName={displayName} />
        <ProfileSummaryCard
          user={user}
          roleLabel={roleLabel}
          isEmployee={isEmployee}
          employeeRoleName={employeeRoleName}
          employeeHeadquartersName={employeeHeadquartersName}
        />
        {isEmployee ? <ProfileEmployee /> : <ProfileClient />}
      </section>
    </PrivateLayout>
  );
}

export default Profile;
