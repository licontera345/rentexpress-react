import { MESSAGES } from '../../../constants';
import PageHeader from '../../common/layout/PageHeader';

// Componente Profile Header que encapsula la interfaz y la lógica principal de esta sección.

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
