import PrivateLayout from '../../components/layout/private/PrivateLayout';
import ProfileHeader from '../../components/profile/headers/ProfileHeader';
import ProfileSummaryCard from '../../components/profile/cards/ProfileSummaryCard';
import ProfileEmployee from './profile/ProfileEmployee';
import ProfileClient from './profile/ProfileClient';
import usePrivateProfilePage from '../../hooks/private/usePrivateProfilePage';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import { MESSAGES } from '../../constants';

function Profile() {
  const { state, profileSection } = usePrivateProfilePage();
  const loadingProfile = profileSection.loadingProfile === true;

  return (
    <PrivateLayout>
      <section className="personal-space profilePage">
        <ProfileHeader
          displayName={state.displayName}
          roleLabel={state.roleLabel}
          headquartersName={state.employeeHeadquartersName}
          profileImageSrc={state.profileImageSrc}
        />
        <ProfileSummaryCard
          user={state.user}
          roleLabel={state.roleLabel}
          isEmployee={state.isEmployee}
          employeeRoleName={state.employeeRoleName}
          employeeHeadquartersName={state.employeeHeadquartersName}
        />
        {state.isEmployee ? (
          <ProfileEmployee
            state={profileSection.state}
            ui={profileSection.ui}
            actions={profileSection.actions}
          />
        ) : loadingProfile ? (
          <div className="profile-loading-wrap">
            <LoadingSpinner message={MESSAGES.LOADING} />
          </div>
        ) : (
          <ProfileClient
            state={profileSection.state}
            ui={profileSection.ui}
            actions={profileSection.actions}
          />
        )}
      </section>
    </PrivateLayout>
  );
}

export default Profile;
