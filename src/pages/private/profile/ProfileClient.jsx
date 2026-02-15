import Button from '../../../components/common/actions/Button';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import useClientProfilePage from '../../../hooks/client/useClientProfilePage';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import ProfileAddressFields from '../../../components/profile/fields/ProfileAddressFields';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import FormActionsWithAlerts from '../../../components/common/forms/FormActionsWithAlerts';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';
import ProfileImageField from '../../../components/profile/fields/ProfileImageField';

function ProfileClient() {
  const { state, ui, actions } = useClientProfilePage();

  return (
    <Card className="personal-space-card personal-space-card--profile">
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>

      <div className="profile-edit-actions">
        <Button
          type="button"
          variant={BUTTON_VARIANTS.OUTLINED}
          onClick={actions.toggleEditMode}
          disabled={ui.isSaving}
        >
          {ui.isEditing ? MESSAGES.CANCEL : MESSAGES.EDIT_PROFILE}
        </Button>
      </div>

      <form className="profile-form" onSubmit={actions.handleSubmit}>
        <section className="profile-section">
          <div className="profile-fields-grid">
            <FormField
              label={MESSAGES.USERNAME}
              type="text"
              name="username"
              value={state.formData.username}
              onChange={actions.handleChange}
              required
              disabled={!ui.isEditing || ui.isSaving}
              error={state.fieldErrors.username}
            />

            <ProfileContactFields
              formData={state.formData}
              fieldErrors={state.fieldErrors}
              isSaving={ui.isSaving || !ui.isEditing}
              onChange={actions.handleChange}
              showBirthDate
              readOnlyEmail
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

        <section className="profile-section">
          <div className="profile-fields-grid">
            <ProfileAddressFields
              formData={state.formData}
              fieldErrors={state.fieldErrors}
              isSaving={ui.isSaving || !ui.isEditing}
              onChange={actions.handleChange}
              provinces={state.provinces}
              cities={state.cities}
              loadingProvinces={ui.loadingProvinces}
              loadingCities={ui.loadingCities}
              provincesError={ui.provincesError}
              citiesError={ui.citiesError}
            />
          </div>
        </section>


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
    </Card>
  );
}

export default ProfileClient;
