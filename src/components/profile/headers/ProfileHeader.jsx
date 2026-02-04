import { MESSAGES } from '../../../constants';
import PageHeader from '../../common/layout/PageHeader';

// Componente ProfileHeader que define la interfaz y organiza la lógica de esta vista.

function ProfileHeader({ displayName }) {
  const greeting = `${MESSAGES.WELCOME_BACK}, ${displayName}`;

  return (
    <PageHeader
      greeting={greeting}
      title={MESSAGES.PROFILE_TITLE}
      subtitle={MESSAGES.PROFILE_SUBTITLE}
    />
  );
}

export default ProfileHeader;
