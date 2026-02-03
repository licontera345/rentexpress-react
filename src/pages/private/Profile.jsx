import PrivateLayout from '../../components/layout/private/PrivateLayout';
import { useAuth } from '../../hooks/useAuth';
import { MESSAGES, USER_ROLES } from '../../constants';
import useHeadquarters from '../../hooks/useHeadquarters';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileSummaryCard from '../../components/profile/ProfileSummaryCard';
import ProfileEmployee from './profile/ProfileEmployee';
import ProfileClient from './profile/ProfileClient';
import {
  resolveEmployeeHeadquartersId,
  resolveEmployeeHeadquartersName,
  resolveEmployeeRoleName
} from '../../config/profileUtils';

function Profile() {
  const { user, role } = useAuth();
  const { headquarters } = useHeadquarters();
  const isEmployee = role === USER_ROLES.EMPLOYEE;
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  const roleLabel = role ? (isEmployee ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE): MESSAGES.NOT_AVAILABLE;
  const employeeRoleName = resolveEmployeeRoleName(user);
  const headquartersNameFromUser = resolveEmployeeHeadquartersName(user);
  const headquartersId = resolveEmployeeHeadquartersId(user);
  const headquartersMatch = headquarters.find(
    (hq) => (hq.headquartersId || hq.id) === headquartersId
  );
  const headquartersNameFromList = headquartersMatch?.headquartersName || headquartersMatch?.name;
  const employeeHeadquartersName = headquartersNameFromUser || headquartersNameFromList;

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
