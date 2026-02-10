import { useState } from 'react';
import Card from '../../../components/common/layout/Card';
import Button from '../../../components/common/actions/Button';
import FormField from '../../../components/common/forms/FormField';
import useEmployeeProfilePage from '../../../hooks/useEmployeeProfilePage';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

// Formulario de perfil para empleados con edición de datos básicos. Aclara los campos editables del staff.
function ProfileEmployee() {
  const { state, ui, actions } = useEmployeeProfilePage();

  return (
    <Card className="personal-space-card personal-space-card--profile">
      {/* Formulario editable del perfil del empleado */}
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={actions.handleSubmit}>
        <FormField
          label={MESSAGES.USERNAME}
          type="text"
          name="employeeName"
          value={state.formData.employeeName}
          onChange={actions.handleChange}
          required
          disabled={ui.isSaving}
          error={state.fieldErrors.employeeName}
        />

        <ProfileContactFields
          formData={state.formData}
          fieldErrors={state.fieldErrors}
          isSaving={ui.isSaving}
          onChange={actions.handleChange}
        />

        <ProfilePasswordFields
          formData={state.formData}
          fieldErrors={state.fieldErrors}
          isSaving={ui.isSaving}
          onChange={actions.handleChange}
        />

        <ProfileFormActions
          errorMessage={ui.errorMessage}
          statusMessage={ui.statusMessage}
          isSaving={ui.isSaving}
        />
      </form>
    </Card>
  );
}

export default ProfileEmployee;
