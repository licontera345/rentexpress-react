import { useState } from 'react';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import useProfileEmployeeForm from '../../../hooks/useProfileEmployeeForm';
import { MESSAGES } from '../../../constants';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

// Formulario de perfil para empleados con edición de datos básicos. Aclara los campos editables del staff.
function ProfileEmployee({ isEditing = false }) {
  const {
    formData,
    fieldErrors,
    statusMessage,
    errorMessage,
    hasChanges,
    isSaving,
    handleChange,
    handleSubmit
  } = useProfileEmployeeForm();
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

  return (
    <>
      <Card className="personal-space-card personal-space-card--profile personal-profile-card">
        <h3>{MESSAGES.PROFILE_PERSONAL_DATA_TITLE}</h3>
        <p>{MESSAGES.PROFILE_PERSONAL_DATA_DESC}</p>

        <form className="profile-form" onSubmit={handleSubmit}>
          <FormField
            label={MESSAGES.USERNAME}
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            disabled={isSaving || !isEditing}
            error={fieldErrors.employeeName}
          />

          <ProfileContactFields
            formData={formData}
            fieldErrors={fieldErrors}
            isSaving={isSaving}
            onChange={handleChange}
            fieldsDisabled={!isEditing}
            emailReadOnly
          />

          <ProfileFormActions
            errorMessage={errorMessage}
            statusMessage={statusMessage}
            isSaving={isSaving}
            disabled={!hasChanges || !isEditing}
          />
        </form>
      </Card>

      <Card className="personal-space-card personal-space-card--profile personal-profile-card">
        <h3>{MESSAGES.PROFILE_SECURITY_TITLE}</h3>
        <form className="profile-form" onSubmit={handleSubmit}>
          <ProfilePasswordFields
            formData={formData}
            fieldErrors={fieldErrors}
            isSaving={isSaving}
            onChange={handleChange}
            isExpanded={isPasswordExpanded}
            onToggle={() => setIsPasswordExpanded((prev) => !prev)}
            disabled={!isEditing}
          />

          <ProfileFormActions
            errorMessage={errorMessage}
            statusMessage={statusMessage}
            isSaving={isSaving}
            disabled={!hasChanges || !isEditing || !isPasswordExpanded}
          />
        </form>
      </Card>
    </>
  );
}

export default ProfileEmployee;
