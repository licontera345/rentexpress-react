import { useState } from 'react';
import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import useClientProfilePage from '../../../hooks/client/useClientProfilePage';
import { MESSAGES } from '../../../constants';
import ProfileAddressFields from '../../../components/profile/fields/ProfileAddressFields';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

function ProfileClient() {
  const { state, ui, actions } = useClientProfilePage();
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  return (
    <Card className="personal-space-card personal-space-card--profile">
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={actions.handleSubmit}>
        <section className="profile-section">
          <h4>{MESSAGES.PROFILE_EDIT_TITLE}</h4>
          <p>Actualiza tu información básica y de contacto.</p>

          <div className="profile-fields-grid">
            <FormField
              label={MESSAGES.USERNAME}
              type="text"
              name="username"
              value={state.formData.username}
              onChange={actions.handleChange}
              required
              disabled={ui.isSaving}
              error={state.fieldErrors.username}
            />

            <ProfileContactFields
              formData={state.formData}
              fieldErrors={state.fieldErrors}
              isSaving={ui.isSaving}
              onChange={actions.handleChange}
              showBirthDate
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

        <ProfileAddressFields
          formData={state.formData}
          fieldErrors={state.fieldErrors}
          isSaving={ui.isSaving}
          onChange={actions.handleChange}
          provinces={state.provinces}
          cities={state.cities}
          loadingProvinces={ui.loadingProvinces}
          loadingCities={ui.loadingCities}
          provincesError={ui.provincesError}
          citiesError={ui.citiesError}
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

export default ProfileClient;
