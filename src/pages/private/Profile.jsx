import { useState } from 'react';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import ProfileHeader from '../../components/profile/headers/ProfileHeader';
import ProfileSummaryCard from '../../components/profile/cards/ProfileSummaryCard';
import ProfileEmployee from './profile/ProfileEmployee';
import ProfileClient from './profile/ProfileClient';
import usePrivateProfilePage from '../../hooks/private/usePrivateProfilePage';

function Profile() {
  const { state } = usePrivateProfilePage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <ProfileHeader displayName={state.displayName} />
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
