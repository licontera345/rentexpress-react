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
  const {
    formData,
    fieldErrors,
    statusMessage,
    errorMessage,
    isSaving,
    provinces,
    cities,
    loadingProvinces,
    loadingCities,
    provincesError,
    citiesError,
    handleChange,
    handleSubmit
  } = useClientProfilePage();

  return (
    <Card className="personal-space-card personal-space-card--profile">
      {/* Formulario editable del perfil del cliente */}
      <h3>{MESSAGES.PROFILE_EDIT_TITLE}</h3>
      <p>{MESSAGES.PROFILE_EDIT_DESC}</p>

      <form className="profile-form" onSubmit={handleSubmit}>
        <FormField
          label={MESSAGES.USERNAME}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={isSaving}
          error={fieldErrors.username}
        />

        <ProfileContactFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
          showBirthDate
        />

        <ProfilePasswordFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
        />

        <ProfileAddressFields
          formData={formData}
          fieldErrors={fieldErrors}
          isSaving={isSaving}
          onChange={handleChange}
          provinces={provinces}
          cities={cities}
          loadingProvinces={loadingProvinces}
          loadingCities={loadingCities}
          provincesError={provincesError}
          citiesError={citiesError}
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

export default ProfileClient;
