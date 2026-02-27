import { MESSAGES, BUTTON_VARIANTS } from '../../../constants';
import Button from '../../common/actions/Button';
import { Card } from '../../common/layout/LayoutPrimitives';
import {
  RegisterContactSection,
  RegisterAddressSection,
  RegisterPasswordSection,
  RegisterTermsSection,
} from './RegisterFormSections';

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
            <RegisterContactSection
              formData={formData}
              fieldErrors={fieldErrors}
              isLoading={isLoading}
              onChange={onChange}
            />

            <RegisterAddressSection
              formData={formData}
              fieldErrors={fieldErrors}
              isLoading={isLoading}
              loadingProvinces={loadingProvinces}
              loadingCities={loadingCities}
              provincesError={provincesError}
              citiesError={citiesError}
              provinces={provinces}
              cities={cities}
              onChange={onChange}
            />

            <RegisterPasswordSection
              formData={formData}
              fieldErrors={fieldErrors}
              isLoading={isLoading}
              onChange={onChange}
            />

            <RegisterTermsSection
              formData={formData}
              fieldErrors={fieldErrors}
              isLoading={isLoading}
              onChange={onChange}
            />

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
              <button type="button" onClick={onLoginClick} className="btn btn-ghost btn-small register-link">
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
