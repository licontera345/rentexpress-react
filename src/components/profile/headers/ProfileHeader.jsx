import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

// Componente ProfileHeader que define la interfaz y organiza la lógica de esta vista.

function ProfileHeader({
  displayName,
  roleLabel,
  employeeHeadquartersName,
  showEditToggle = false,
  isEditing = false,
  onEditToggle
}) {
  return (
    <header className="personal-space-header personal-profile-header">
      <div>
        <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}</p>
        <h1>{displayName}</h1>
        <p className="personal-space-subtitle">{MESSAGES.PROFILE_SUBTITLE}</p>
        <div className="personal-space-meta">
          <span className="personal-space-meta-label">{MESSAGES.ACCOUNT_TYPE}</span>
          <span className="personal-space-meta-value">{roleLabel}</span>
          <span className="personal-space-meta-label">{MESSAGES.HEADQUARTERS_LABEL}</span>
          <span className="personal-space-meta-value">{employeeHeadquartersName || MESSAGES.NOT_AVAILABLE}</span>
        </div>
      </div>

      {showEditToggle ? (
        <Button
          type="button"
          variant={BUTTON_VARIANTS.SECONDARY}
          size="small"
          onClick={onEditToggle}
        >
          {isEditing ? MESSAGES.CANCEL : MESSAGES.EDIT_PROFILE}
        </Button>
      ) : null}
    </header>
  );
}

export default ProfileHeader;
