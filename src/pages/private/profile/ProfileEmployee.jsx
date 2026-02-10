import { useState } from 'react';
import Card from '../../../components/common/layout/Card';
import Button from '../../../components/common/actions/Button';
import FormField from '../../../components/common/forms/FormField';
import useEmployeeProfilePage from '../../../hooks/useEmployeeProfilePage';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

function ProfileEmployee({ isEditEnabled = true }) {
  const {
    formData,
    fieldErrors,
    statusMessage,
    errorMessage,
    isSaving,
    isDirty,
    hasPasswordInput,
    handleChange,
    handleSubmit,
    resetPasswordFields
  } = useEmployeeProfilePage();
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handlePasswordToggle = () => {
    const nextShowPassword = !showPasswordFields;
    setShowPasswordFields(nextShowPassword);

    if (!nextShowPassword && hasPasswordInput) {
      resetPasswordFields();
    }
  };

  return (
    <>
      <Card className="personal-space-card personal-space-card--profile profile-card">
        <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
        <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

        <form className="profile-form profile-form--two-columns" onSubmit={handleSubmit}>
          <FormField
            label={MESSAGES.USERNAME}
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            disabled={isSaving || !isEditEnabled}
            error={fieldErrors.employeeName}
          />

          <ProfileContactFields
            formData={formData}
            fieldErrors={fieldErrors}
            isSaving={isSaving || !isEditEnabled}
            onChange={handleChange}
            readOnlyEmail
          />

          <ProfileFormActions
            errorMessage={errorMessage}
            statusMessage={statusMessage}
            isSaving={isSaving}
            isSubmitDisabled={isSaving || !isEditEnabled || !isDirty}
          />
        </form>
      </Card>

      <Card className="personal-space-card personal-space-card--profile profile-card">
        <div className="profile-security-header">
          <div>
            <h3>{MESSAGES.PASSWORD_CHANGE_TITLE}</h3>
            <p>{MESSAGES.PASSWORD_CHANGE_DESC}</p>
          </div>
          <Button
            type="button"
            variant={BUTTON_VARIANTS.GHOST}
            disabled={isSaving || !isEditEnabled}
            onClick={handlePasswordToggle}
          >
            {showPasswordFields ? MESSAGES.CANCEL : MESSAGES.CHANGE_PASSWORD}
          </Button>
        </div>

        {showPasswordFields && (
          <form className="profile-form profile-form--two-columns" onSubmit={handleSubmit}>
            <ProfilePasswordFields
              formData={formData}
              fieldErrors={fieldErrors}
              isSaving={isSaving || !isEditEnabled}
              onChange={handleChange}
              compact
            />

            <ProfileFormActions
              errorMessage={errorMessage}
              statusMessage={statusMessage}
              isSaving={isSaving}
              isSubmitDisabled={isSaving || !isEditEnabled || !isDirty}
            />
          </form>
        )}
      </Card>
    </>
  );
}

export default ProfileEmployee;
