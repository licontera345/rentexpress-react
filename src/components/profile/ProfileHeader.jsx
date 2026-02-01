import { MESSAGES } from '../../constants';
import PageHeader from '../common/layout/PageHeader';

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
