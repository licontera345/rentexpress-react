import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import FormField from '../../common/forms/FormField';

// Componente ProfilePasswordFields que define la interfaz y organiza la lógica de esta vista.

function ProfilePasswordFields({
  formData,
  fieldErrors,
  isSaving,
  onChange,
  isExpanded = true,
  onToggle,
  disabled = false
}) {
  const showToggle = typeof onToggle === 'function';

  return (
    <>
      <div className="profile-form-section profile-form-section--security">
        <div>
          <h4>{MESSAGES.PASSWORD_CHANGE_TITLE}</h4>
          <p>{MESSAGES.PASSWORD_CHANGE_DESC}</p>
        </div>
        {showToggle ? (
          <Button
            type="button"
            variant={BUTTON_VARIANTS.SECONDARY}
            size="small"
            onClick={onToggle}
            disabled={isSaving}
          >
            {isExpanded ? MESSAGES.CANCEL : MESSAGES.CHANGE_PASSWORD}
          </Button>
        ) : null}
      </div>

      {isExpanded ? (
        <>
          <FormField
            label={MESSAGES.NEW_PASSWORD}
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            disabled={isSaving || disabled}
            error={fieldErrors.password}
            helper={MESSAGES.PASSWORD_HELPER}
          />

          <FormField
            label={MESSAGES.CONFIRM_PASSWORD}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            disabled={isSaving || disabled}
            error={fieldErrors.confirmPassword}
          />
        </>
      ) : null}
    </>
  );
}

export default ProfilePasswordFields;
