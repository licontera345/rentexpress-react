import PrivateLayout from '../../components/layout/private/PrivateLayout';
import { useAuth } from '../../hooks/useAuth';
import { MESSAGES, USER_ROLES } from '../../constants';
import useHeadquarters from '../../hooks/useHeadquarters';
import ProfileHeader from '../../components/profile/headers/ProfileHeader';
import ProfileSummaryCard from '../../components/profile/cards/ProfileSummaryCard';
import ProfileEmployee from './profile/ProfileEmployee';
import ProfileClient from './profile/ProfileClient';
import {
  resolveEmployeeHeadquartersId,
  resolveEmployeeHeadquartersName,
  resolveEmployeeRoleName
} from '../../config/profileUtils';

// Página de perfil que muestra datos comunes y específicos por rol. Consolida la información del usuario autenticado.
function Profile() {
  const { user, role } = useAuth();
  const { headquarters } = useHeadquarters();
  const isEmployee = role === USER_ROLES.EMPLOYEE;
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  // Etiquetas amigables para el rol y la sede del empleado.
  const roleLabel = role ? (isEmployee ? MESSAGES.EMPLOYEE_ROLE : MESSAGES.CUSTOMER_ROLE): MESSAGES.NOT_AVAILABLE;
  const employeeRoleName = resolveEmployeeRoleName(user);
  const headquartersNameFromUser = resolveEmployeeHeadquartersName(user);
  const headquartersId = resolveEmployeeHeadquartersId(user);
  const headquartersMatch = headquarters.find(
    (hq) => hq.id === headquartersId
  );
  const headquartersNameFromList = headquartersMatch?.name;
  const employeeHeadquartersName = headquartersNameFromUser || headquartersNameFromList;

  return (
    <PrivateLayout>
      {/* Contenido del perfil dentro del layout privado */}
      <section className="personal-space">
        <ProfileHeader displayName={displayName} />

        {/* Resumen del usuario y metadatos del rol */}
        <ProfileSummaryCard
          user={user}
          roleLabel={roleLabel}
          isEmployee={isEmployee}
          employeeRoleName={employeeRoleName}
          employeeHeadquartersName={employeeHeadquartersName}
        />

        {/* Renderiza el perfil correspondiente según el rol */}
        {isEmployee ? <ProfileEmployee /> : <ProfileClient />}
      </section>
    </PrivateLayout>
  );
}

export default Profile;
