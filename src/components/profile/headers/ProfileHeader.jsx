import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function ProfileHeader({
  displayName,
  roleLabel,
  headquartersName,
  onEditProfile,
  onQuickAccess,
  profileImageSrc
}) {
  const greeting = `${MESSAGES.WELCOME_BACK}, ${displayName}`;
  const showActions = typeof onEditProfile === 'function' || typeof onQuickAccess === 'function';

  return (
    <header className="profile-hero">
      <div className="profile-hero-main">
        <div className="profile-hero-avatar" aria-hidden="true">
          {profileImageSrc ? <img src={profileImageSrc} alt={displayName} className="profile-hero-avatar-image" /> : null}
        </div>
        <div>
          <p className="personal-space-greeting">{greeting}</p>
          <h1>{displayName}</h1>
        </div>
      </div>

      {showActions && (
        <div className="profile-hero-actions">
          {typeof onEditProfile === 'function' && (
            <Button type="button" variant={BUTTON_VARIANTS.OUTLINED} onClick={onEditProfile}>
              {MESSAGES.EDIT_PROFILE}
            </Button>
          )}

          {typeof onQuickAccess === 'function' && (
            <Button type="button" variant={BUTTON_VARIANTS.PRIMARY} onClick={onQuickAccess}>
              {MESSAGES.QUICK_ACCESS}
            </Button>
          )}
        </div>
      )}

      <div className="profile-hero-secondary">
        <p className="personal-space-subtitle">{MESSAGES.PROFILE_SUBTITLE}</p>
        <div className="profile-hero-meta">
          <span className="profile-hero-pill">{roleLabel}</span>
          <span className="profile-hero-pill">{MESSAGES.HEADQUARTERS_LABEL}: {headquartersName || MESSAGES.NOT_AVAILABLE}</span>
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
