import Button from '../../../components/common/actions/Button';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import FormField from '../../../components/common/forms/FormField';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import ProfileAddressFields from '../../../components/profile/fields/ProfileAddressFields';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import FormActionsWithAlerts from '../../../components/common/forms/FormActionsWithAlerts';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';
import ProfileImageField from '../../../components/profile/fields/ProfileImageField';

function formatDisplayDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return MESSAGES.NOT_AVAILABLE_SHORT;
  const parts = String(dateStr).trim().split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatAddressDisplay(formData, provinces = [], cities = []) {
  const street = (formData.street || '').trim();
  const number = (formData.number || '').trim();
  const provinceId = formData.provinceId;
  const cityId = formData.cityId;
  const province = provinces.find((p) => (p.provinceId ?? p.id) == provinceId);
  const city = cities.find((c) => (c.id ?? c.cityId) == cityId);
  const provinceName = province?.provinceName ?? province?.name ?? '';
  const cityName = city?.cityName ?? city?.name ?? '';
  const addressLine = [street, number].filter(Boolean).join(', ');
  const locationLine = [cityName, provinceName].filter(Boolean).join(', ');
  const full = [addressLine, locationLine].filter(Boolean).join(' · ');
  return full || MESSAGES.NOT_AVAILABLE_SHORT;
}

function ProfileClient({ state, ui, actions }) {

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
            <span className="profile-summary-item-label">{MESSAGES.USERNAME}</span>
            <span className="profile-summary-item-value">{state.formData.username || MESSAGES.NOT_AVAILABLE_SHORT}</span>
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
            <span className="profile-summary-item-label">{MESSAGES.BIRTH_DATE}</span>
            <span className="profile-summary-item-value">{formatDisplayDate(state.formData.birthDate)}</span>
          </div>
          <div className="profile-summary-item">
            <span className="profile-summary-item-label">{MESSAGES.EMAIL}</span>
            <span className="profile-summary-item-value">{state.formData.email || MESSAGES.NOT_AVAILABLE_SHORT}</span>
          </div>
          <div className="profile-summary-item">
            <span className="profile-summary-item-label">{MESSAGES.PHONE}</span>
            <span className="profile-summary-item-value">{state.formData.phone || MESSAGES.NOT_AVAILABLE_SHORT}</span>
          </div>
          <div className="profile-summary-item">
            <span className="profile-summary-item-label">{MESSAGES.ADDRESS_SECTION_TITLE}</span>
            <span className="profile-summary-item-value">{formatAddressDisplay(state.formData, state.provinces, state.cities)}</span>
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
      )}
    </Card>
  );
}

export default ProfileClient;
