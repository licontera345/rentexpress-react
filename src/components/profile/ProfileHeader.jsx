import { MESSAGES } from '../../constants';

function ProfileHeader({ displayName }) {
  return (
    <header className="personal-space-header">
      <div>
        <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}, {displayName}</p>
        <h1>{MESSAGES.PROFILE_TITLE}</h1>
        <p className="personal-space-subtitle">{MESSAGES.PROFILE_SUBTITLE}</p>
      </div>
    </header>
  );
}

export default ProfileHeader;
