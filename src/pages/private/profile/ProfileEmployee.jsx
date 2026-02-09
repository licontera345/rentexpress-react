import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import useProfileEmployeeForm from '../../../hooks/useProfileEmployeeForm';
import { MESSAGES } from '../../../constants';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

// Formulario de perfil para empleados con edición de datos básicos. Aclara los campos editables del staff.
function ProfileEmployee() {
  const {
    formData,
    fieldErrors,
    statusMessage,
    errorMessage,
    isSaving,
    handleChange,
    handleSubmit
  } = useProfileEmployeeForm();

  return (
    <Card className="personal-space-card personal-space-card--profile">
      {/* Formulario editable del perfil del empleado */}
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={handleSubmit}>
        <FormField
          label={MESSAGES.USERNAME}
          type="text"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.employeeName}
        />

        <ProfileContactFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
        />

        <ProfilePasswordFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
        />

        <ProfileFormActions
          errorMessage={errorMessage}
          statusMessage={statusMessage}
          isSaving={isSaving}
        />
      </form>
    </Card>
  );
}

export default ProfileEmployee;
