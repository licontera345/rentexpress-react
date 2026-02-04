import FormField from '../../common/forms/FormField';
import { MESSAGES } from '../../../constants';

// Componente Profile Address Fields que encapsula la interfaz y la lógica principal de esta sección.

function ProfileAddressFields({
  formData,
  fieldErrors,
  isSaving,
  onChange,
  provinces,
  cities,
  loadingProvinces,
  loadingCities,
  provincesError,
  citiesError
}) {
  return (
    <>
      <div className="profile-form-section">
        <h4>{MESSAGES.ADDRESS_SECTION_TITLE}</h4>
        <p>{MESSAGES.ADDRESS_SECTION_DESC}</p>
      </div>

      <FormField
        label={MESSAGES.STREET}
        type="text"
        name="street"
        value={formData.street}
        onChange={onChange}
        required
        disabled={isSaving}
        error={fieldErrors.street}
      />

      <FormField
        label={MESSAGES.NUMBER}
        type="text"
        name="number"
        value={formData.number}
        onChange={onChange}
        required
        disabled={isSaving}
        error={fieldErrors.number}
      />

      <FormField
        label={MESSAGES.PROVINCE}
        name="provinceId"
        value={formData.provinceId}
        onChange={onChange}
        required
        disabled={isSaving || loadingProvinces}
        error={fieldErrors.provinceId}
        as="select"
        helper={provincesError || null}
      >
        <option value="">{MESSAGES.SELECT_PROVINCE}</option>
        {provinces.map((province) => (
          <option key={province.provinceId || province.id} value={province.provinceId || province.id}>
            {province.provinceName || province.name}
          </option>
        ))}
      </FormField>

      <FormField
        label={MESSAGES.CITY}
        name="cityId"
        value={formData.cityId}
        onChange={onChange}
        required
        disabled={isSaving || loadingCities || !formData.provinceId}
        error={fieldErrors.cityId}
        as="select"
        helper={citiesError || null}
      >
        <option value="">{MESSAGES.SELECT_CITY}</option>
        {cities.map((city) => (
          <option key={city.cityId || city.id} value={city.cityId || city.id}>
            {city.cityName || city.name}
          </option>
        ))}
      </FormField>
    </>
  );
}

export default ProfileAddressFields;
