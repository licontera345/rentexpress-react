import Card from '../../../components/common/layout/Card';
import FormField from '../../../components/common/forms/FormField';
import useClientProfilePage from '../../../hooks/useClientProfilePage';
import { MESSAGES } from '../../../constants';
import ProfileAddressFields from '../../../components/profile/fields/ProfileAddressFields';
import ProfileContactFields from '../../../components/profile/fields/ProfileContactFields';
import ProfileFormActions from '../../../components/profile/actions/ProfileFormActions';
import ProfilePasswordFields from '../../../components/profile/fields/ProfilePasswordFields';

// Componente ProfileClient que define la interfaz y organiza la lógica de esta vista. Se enfoca en datos del cliente.

function ProfileClient() {
  const { state, ui, actions } = useClientProfilePage();

  return (
    <Card className="personal-space-card personal-space-card--profile">
      {/* Formulario editable del perfil del cliente */}
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={actions.handleSubmit}>
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

        <ProfilePasswordFields
          formData={state.formData}
          fieldErrors={state.fieldErrors}
          isSaving={ui.isSaving}
          onChange={actions.handleChange}
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
        />
      </form>
    </Card>
  );
}

export default ProfileClient;
