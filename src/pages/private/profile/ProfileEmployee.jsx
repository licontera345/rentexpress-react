import Button from '../../../components/common/actions/Button';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import FormField from '../../../components/common/forms/FormField';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import FormActionsWithAlerts from '../../../components/common/forms/FormActionsWithAlerts';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';
import ProfileImageField from '../../../components/profile/fields/ProfileImageField';

function ProfileEmployee({ state, ui, actions }) {

  return (
    <Card className={`personal-space-card personal-space-card--profile personal-space-card--profile-collapsible ${ui.isEditing ? 'is-expanded' : ''}`}>
      <div className="profile-edit-action profile-edit-action--header">
        <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
        <Button
          type="button"
          variant={BUTTON_VARIANTS.OUTLINED}
          onClick={actions.toggleEditMode}
          disabled={ui.isSaving}
        >
          {ui.isEditing ? MESSAGES.CANCEL : MESSAGES.EDIT_PROFILE}
        </Button>
      </div>

      {!ui.isEditing && (
        <div className="profile-summary-grid profile-summary-grid--read">
          <div className="profile-summary-item">
            <span className="profile-summary-item-label">{MESSAGES.FIRST_NAME}</span>
            <span className="profile-summary-item-value">{state.formData.firstName || MESSAGES.NOT_AVAILABLE_SHORT}</span>
          </div>
          <div className="profile-summary-item">
            <span className="profile-summary-item-label">{MESSAGES.LAST_NAME_1}</span>
            <span className="profile-summary-item-value">{state.formData.lastName1 || MESSAGES.NOT_AVAILABLE_SHORT}</span>
          </div>
          <div className="profile-summary-item">
            <span className="profile-summary-item-label">{MESSAGES.LAST_NAME_2}</span>
            <span className="profile-summary-item-value">{state.formData.lastName2 || MESSAGES.NOT_AVAILABLE_SHORT}</span>
          </div>
          <div className="profile-summary-item">
            <span className="profile-summary-item-label">{MESSAGES.PHONE}</span>
            <span className="profile-summary-item-value">{state.formData.phone || MESSAGES.NOT_AVAILABLE_SHORT}</span>
          </div>
        </div>
      )}

      {ui.isEditing && (
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
              disabled={!ui.isEditing || ui.isSaving}
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
              disabled={!ui.isEditing || ui.isSaving}
              error={state.fieldErrors.firstName}
            />

            <FormField
              label={MESSAGES.LAST_NAME_1}
              type="text"
              name="lastName1"
              value={`${state.formData.lastName1} ${state.formData.lastName2}`.trim()}
              onChange={actions.handleChange}
              readOnly
              disabled
              error={state.fieldErrors.lastName1 || state.fieldErrors.lastName2}
            />

            <FormField
              label={MESSAGES.PHONE}
              type="tel"
              name="phone"
              value={state.formData.phone}
              onChange={actions.handleChange}
              required
              disabled={!ui.isEditing || ui.isSaving}
              error={state.fieldErrors.phone}
            />
          </div>
        </section>

        <ProfilePasswordFields
          formData={state.formData}
          fieldErrors={state.fieldErrors}
          isSaving={ui.isSaving || !ui.isEditing}
          onChange={actions.handleChange}
          isExpanded={ui.showPasswordFields}
          onToggle={actions.togglePasswordFields}
          showToggle
          wrapperClassName="profile-password-grid"
        />

        <ProfileImageField
          imageSrc={state.profileImage.imageSrc}
          previewSrc={state.profileImage.previewSrc}
          selectedFileName={state.profileImage.selectedFileName}
          fileError={state.profileImage.fileError}
          isDisabled={!ui.isEditing || ui.isSaving}
          onFileChange={actions.handleProfileImageChange}
          onRemoveSelectedFile={actions.resetProfileImage}
        />

        <FormActionsWithAlerts
          errorMessage={ui.errorMessage}
          statusMessage={ui.statusMessage}
          isSaving={ui.isSaving}
          isSubmitDisabled={!ui.isEditing || !ui.isDirty || ui.isSaving}
          onCancel={actions.handleReset}
        />
      </form>
      )}
    </Card>
  );
}

export default ProfileEmployee;
