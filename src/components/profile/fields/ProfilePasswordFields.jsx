import FormField from '../../common/forms/FormField';
import { MESSAGES } from '../../../constants';

function ProfilePasswordFields({ formData, fieldErrors, isSaving, onChange, compact = false }) {
  return (
    <>
      {!compact && (
        <div className="profile-form-section">
          <h4>{MESSAGES.PASSWORD_CHANGE_TITLE}</h4>
          <p>{MESSAGES.PASSWORD_CHANGE_DESC}</p>
        </div>
      )}

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
    </>
  );
}

export default ProfilePasswordFields;
