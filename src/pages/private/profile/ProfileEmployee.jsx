import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import useEmployeeProfilePage from '../../../hooks/employee/useEmployeeProfilePage';
import { MESSAGES } from '../../../constants';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

function ProfileEmployee() {
  const { state, ui, actions } = useEmployeeProfilePage();

  return (
    <Card className="personal-space-card personal-space-card--profile">
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>

      <form className="profile-form" onSubmit={actions.handleSubmit}>
        <section className="profile-section">
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

            <FormField
              label={MESSAGES.EMAIL}
              type="email"
              name="email"
              value={state.formData.email}
              onChange={actions.handleChange}
              required
              disabled
              error={state.fieldErrors.email}
            />

            <FormField
              label={MESSAGES.FIRST_NAME}
              type="text"
              name="firstName"
              value={state.formData.firstName}
              onChange={actions.handleChange}
              required
              disabled={ui.isSaving}
              error={state.fieldErrors.firstName}
            />

            <FormField
              label={MESSAGES.LAST_NAME_1}
              type="text"
              name="lastName1"
              value={`${state.formData.lastName1} ${state.formData.lastName2}`.trim()}
              onChange={actions.handleChange}
              readOnly
              disabled={ui.isSaving}
              error={state.fieldErrors.lastName1 || state.fieldErrors.lastName2}
            />

            <FormField
              label={MESSAGES.PHONE}
              type="tel"
              name="phone"
              value={state.formData.phone}
              onChange={actions.handleChange}
              required
              disabled={ui.isSaving}
              error={state.fieldErrors.phone}
            />
          </div>
        </section>

        <ProfilePasswordFields
          formData={state.formData}
          fieldErrors={state.fieldErrors}
          isSaving={ui.isSaving}
          onChange={actions.handleChange}
          isExpanded
          showToggle={false}
          wrapperClassName="profile-password-grid"
        />

        <ProfileFormActions
          errorMessage={ui.errorMessage}
          statusMessage={ui.statusMessage}
          isSaving={ui.isSaving}
          isSubmitDisabled={!ui.isDirty || ui.isSaving}
          onCancel={actions.handleReset}
        />
      </form>
    </Card>
  );
}

export default ProfileEmployee;
