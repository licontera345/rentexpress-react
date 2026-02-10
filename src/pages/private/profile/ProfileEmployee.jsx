import { useState } from 'react';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import useEmployeeProfilePage from '../../../hooks/useEmployeeProfilePage';
import { MESSAGES } from '../../../constants';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

function ProfileEmployee() {
  const { state, ui, actions } = useEmployeeProfilePage();
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  return (
    <Card className="personal-space-card personal-space-card--profile">
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={actions.handleSubmit}>
        <section className="profile-section">
          <h4>{MESSAGES.PROFILE_EDIT_TITLE}</h4>
          <p>Actualiza tu información personal del personal interno.</p>

          <div className="profile-fields-grid">
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
          </div>
        </section>

        <ProfilePasswordFields
          formData={state.formData}
          fieldErrors={state.fieldErrors}
          isSaving={ui.isSaving}
          onChange={actions.handleChange}
          isExpanded={showPasswordFields}
          onToggle={() => setShowPasswordFields((prev) => !prev)}
          wrapperClassName="profile-password-grid"
        />

        <ProfileFormActions
          errorMessage={ui.errorMessage}
          statusMessage={ui.statusMessage}
          isSaving={ui.isSaving}
          isSubmitDisabled={!ui.isDirty || ui.isSaving}
        />
      </form>
    </Card>
  );
}

export default ProfileEmployee;
