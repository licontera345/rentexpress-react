import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function ProfileHeader({ displayName, roleLabel, headquartersName, showEditToggle = false, isEditEnabled = true, onToggleEdit }) {
  const greeting = `${MESSAGES.WELCOME_BACK}, ${displayName}`;

  return (
    <header className="profile-hero">
      <div>
        <p className="personal-space-greeting">{greeting}</p>
        <h1>{displayName}</h1>
        <p className="personal-space-subtitle">{MESSAGES.PROFILE_SUBTITLE}</p>
        <div className="profile-hero-meta">
          <span className="profile-hero-pill">{roleLabel}</span>
          <span className="profile-hero-pill">{MESSAGES.HEADQUARTERS_LABEL}: {headquartersName || MESSAGES.NOT_AVAILABLE}</span>
        </div>
      </div>

      {showEditToggle && (
        <Button type="button" variant={BUTTON_VARIANTS.GHOST} onClick={onToggleEdit}>
          {isEditEnabled ? MESSAGES.CANCEL : MESSAGES.EDIT_PROFILE}
        </Button>
      )}
    </header>
  );
}

export default ProfileHeader;
