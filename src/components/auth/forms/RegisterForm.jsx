import { Link } from 'react-router-dom';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../../../constants';
import FormField from '../../common/forms/FormField';
import Button from '../../common/actions/Button';
import Card from '../../common/layout/Card';

// Componente RegisterForm que define la interfaz y organiza la lógica de esta vista.

function RegisterForm({
  formData,
  fieldErrors,
  error,
  isLoading,
  loadingProvinces,
  provincesError,
  provinces,
  loadingCities,
  citiesError,
  cities,
  onChange,
  onSubmit,
  onLoginClick,
}) {
  return (
    <div className="register-container">
      <div className="register-wrapper">
        <Card className="register-card">
          <div className="register-header">
            <h1>{MESSAGES.REGISTER_TITLE}</h1>
            <p className="register-subtitle">{MESSAGES.REGISTER_CLIENT_ONLY}</p>
          </div>

          <form onSubmit={onSubmit} className="register-form">
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
              {cities.map((city) => (
                <option key={city.cityId} value={city.cityId}>
                  {city.cityName}
                </option>
              ))}
            </FormField>

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
                  {MESSAGES.ACCEPT_TERMS_PREFIX}
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

            {error && (
              <p className="register-error register-full" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant={BUTTON_VARIANTS.PRIMARY}
              size="large"
              className="register-submit register-full"
              disabled={isLoading}
            >
              {isLoading ? MESSAGES.STARTING : MESSAGES.CREATE_ACCOUNT}
            </Button>
          </form>

          <div className="register-footer">
            <p>
              {MESSAGES.HAVE_ACCOUNT}{' '}
              <button type="button" onClick={onLoginClick} className="register-link">
                {MESSAGES.SIGN_IN_HERE}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RegisterForm;
