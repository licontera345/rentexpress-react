import { Link } from 'react-router-dom';
import FormField from '../../common/forms/FormField';
import { MESSAGES, ROUTES } from '../../../constants';

export function RegisterContactSection({ formData, fieldErrors, isLoading, onChange }) {
  return (
    <>
      <FormField
        label={MESSAGES.FIRST_NAME}
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={onChange}
        required
        disabled={isLoading}
        error={fieldErrors.firstName}
        placeholder={MESSAGES.FIRST_NAME_PLACEHOLDER}
      />
      <FormField
        label={MESSAGES.LAST_NAME_1}
        type="text"
        name="lastName1"
        value={formData.lastName1}
        onChange={onChange}
        required
        disabled={isLoading}
        error={fieldErrors.lastName1}
        placeholder={MESSAGES.LAST_NAME_1_PLACEHOLDER}
      />
      <FormField
        label={MESSAGES.LAST_NAME_2}
        type="text"
        name="lastName2"
        value={formData.lastName2}
        onChange={onChange}
        disabled={isLoading}
        error={fieldErrors.lastName2}
        placeholder={MESSAGES.LAST_NAME_2_PLACEHOLDER}
      />
      <FormField
        label={MESSAGES.BIRTH_DATE}
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={onChange}
        required
        disabled={isLoading}
        error={fieldErrors.birthDate}
      />
      <FormField
        label={MESSAGES.USERNAME}
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
        placeholder={MESSAGES.USERNAME_PLACEHOLDER}
        required
        disabled={isLoading}
        error={fieldErrors.username}
      />
      <FormField
        label={MESSAGES.EMAIL}
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder={MESSAGES.EMAIL_PLACEHOLDER}
        required
        disabled={isLoading}
        error={fieldErrors.email}
      />
      <FormField
        label={MESSAGES.PHONE}
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        placeholder={MESSAGES.PHONE_PLACEHOLDER}
        required
        disabled={isLoading}
        error={fieldErrors.phone}
      />
    </>
  );
}

export function RegisterAddressSection({
  formData,
  fieldErrors,
  isLoading,
  loadingProvinces,
  loadingCities,
  provincesError,
  citiesError,
  provinces,
  cities,
  onChange,
}) {
  return (
    <>
      <div className="register-full register-section-title">
        <h3>{MESSAGES.ADDRESS_SECTION_TITLE}</h3>
        <p>{MESSAGES.ADDRESS_SECTION_DESC}</p>
      </div>
      <FormField
        label={MESSAGES.STREET}
        type="text"
        name="street"
        value={formData.street}
        onChange={onChange}
        placeholder={MESSAGES.STREET_PLACEHOLDER}
        required
        disabled={isLoading}
        error={fieldErrors.street}
      />
      <FormField
        label={MESSAGES.NUMBER}
        type="text"
        name="number"
        value={formData.number}
        onChange={onChange}
        placeholder={MESSAGES.NUMBER_PLACEHOLDER}
        required
        disabled={isLoading}
        error={fieldErrors.number}
      />
      <FormField
        label={MESSAGES.PROVINCE}
        name="provinceId"
        value={formData.provinceId}
        onChange={onChange}
        required
        disabled={isLoading || loadingProvinces}
        error={fieldErrors.provinceId}
        as="select"
        helper={provincesError || null}
      >
        <option value="">{MESSAGES.SELECT_PROVINCE}</option>
        {provinces.map((province) => (
          <option key={province.provinceId} value={province.provinceId}>
            {province.provinceName}
          </option>
        ))}
      </FormField>
      <FormField
        label={MESSAGES.CITY}
        name="cityId"
        value={formData.cityId}
        onChange={onChange}
        required
        disabled={isLoading || loadingCities || !formData.provinceId}
        error={fieldErrors.cityId}
        as="select"
        helper={citiesError || null}
      >
        <option value="">{MESSAGES.SELECT_CITY}</option>
        {cities.map((city, index) => {
          const cityId = city.id ?? city.cityId;
          return (
            <option key={cityId ?? `city-${index}`} value={cityId ?? ''}>
              {city.cityName}
            </option>
          );
        })}
      </FormField>
    </>
  );
}

export function RegisterPasswordSection({ formData, fieldErrors, isLoading, onChange }) {
  return (
    <>
      <FormField
        label={MESSAGES.PASSWORD}
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        placeholder={MESSAGES.PASSWORD_PLACEHOLDER}
        required
        disabled={isLoading}
        error={fieldErrors.password}
        helper={MESSAGES.PASSWORD_HELPER}
      />
      <FormField
        label={MESSAGES.CONFIRM_PASSWORD}
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onChange}
        required
        disabled={isLoading}
        error={fieldErrors.confirmPassword}
      />
    </>
  );
}

export function RegisterTermsSection({ formData, fieldErrors, isLoading, onChange }) {
  return (
    <div className="register-terms register-full">
      <label className="register-terms-label">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={onChange}
          disabled={isLoading}
        />
        <span>
          {MESSAGES.ACCEPT_TERMS_BEFORE}
          <Link className="register-policy-link" to={ROUTES.TERMS}>
            {MESSAGES.TERMS_LINK}
          </Link>
          {MESSAGES.ACCEPT_TERMS_AND}
          <Link className="register-policy-link" to={ROUTES.PRIVACY_POLICY}>
            {MESSAGES.PRIVACY_POLICY_LINK}
          </Link>
        </span>
      </label>
      {fieldErrors.acceptTerms && (
        <p className="form-error" role="alert">
          {fieldErrors.acceptTerms}
        </p>
      )}
    </div>
  );
}
