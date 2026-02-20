import FormField from '../../common/forms/FormField';
import { MESSAGES } from '../../../constants';

// Componente ProfileAddressFields que define la interfaz y organiza la lógica de esta vista.

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
        {provinces.map((province, index) => {
          const provinceId = province.provinceId;
          const optionKey = provinceId ?? `province-${index}`;

          return (
            <option key={optionKey} value={provinceId ?? ''}>
              {province.provinceName}
            </option>
          );
        })}
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
        {cities.map((city, index) => {
          const cityId = city.id;
          const optionKey = cityId ?? `city-${index}`;

          return (
            <option key={optionKey} value={cityId ?? ''}>
              {city.cityName}
            </option>
          );
        })}
      </FormField>
    </>
  );
}

export default ProfileAddressFields;
