import Button from '../../common/actions/Button';
import FormField from '../../common/forms/FormField';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function ProfilePasswordFields({
  formData,
  fieldErrors,
  isSaving,
  onChange,
  compact = false,
  isExpanded = false,
  onToggle,
  wrapperClassName = ''
}) {
  return (
    <section className="profile-section">
      {!compact && (
        <div className="profile-form-section">
          <h4>{MESSAGES.SECURITY}</h4>
          <p>{MESSAGES.PASSWORD_CHANGE_DESC}</p>
        </div>
      )}

      <div className="profile-security-toggle">
        <Button
          type="button"
          variant={BUTTON_VARIANTS.SECONDARY}
          onClick={onToggle}
          disabled={isSaving}
        >
          {MESSAGES.CHANGE_PASSWORD}
        </Button>
      </div>

      <div className={wrapperClassName} hidden={!isExpanded}>
        <FormField
          label={MESSAGES.NEW_PASSWORD}
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          disabled={isSaving}
          error={fieldErrors.password}
          helper={MESSAGES.PASSWORD_HELPER}
        />

        <FormField
          label={MESSAGES.CONFIRM_PASSWORD}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          disabled={isSaving}
          error={fieldErrors.confirmPassword}
        />
      </div>
    </section>
  );
}

export default ProfilePasswordFields;
