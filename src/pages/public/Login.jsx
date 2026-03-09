import PublicLayout from '../../components/layout/public/PublicLayout';
import LoginForm from '../../components/auth/forms/LoginForm';
import usePublicLoginPage from '../../hooks/public/usePublicLoginPage';
import { MESSAGES } from '../../constants';
import FormField from '../../components/common/forms/FormField';
import Button from '../../components/common/actions/Button';
import { Card } from '../../components/common/layout/LayoutPrimitives';
import { FiArrowLeft, FiShield } from 'react-icons/fi';

function Login() {
  const { state, ui, actions } = usePublicLoginPage();

  if (state.pending2FA) {
    return (
      <PublicLayout>
        <div className="login-container">
          <div className="login-wrapper">
            <Card className="login-card">
              <div className="login-header">
                <h1><FiShield aria-hidden="true" /> {MESSAGES.TWO_FACTOR_TITLE}</h1>
                <p className="login-subtitle">{MESSAGES.TWO_FACTOR_ENTER_CODE}</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const code = e.target.code?.value;
                  if (code) actions.handleVerify2FA(code);
                }}
                className="login-form"
              >
                <FormField
                  label={MESSAGES.TWO_FACTOR_ENTER_CODE}
                  type="text"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder={MESSAGES.TWO_FACTOR_CODE_PLACEHOLDER}
                  required
                  disabled={ui.isVerifying2FA}
                  maxLength={6}
                />
                {ui.errorMessage && (
                  <p className="login-error" role="alert">{ui.errorMessage}</p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  className="login-submit"
                  disabled={ui.isVerifying2FA}
                >
                  {ui.isVerifying2FA ? MESSAGES.VERIFYING_CODE : MESSAGES.TWO_FACTOR_VERIFY}
                </Button>
                <p className="login-footer">
                  <button
                    type="button"
                    className="link-button"
                    onClick={actions.handleBackFrom2FA}
                    disabled={ui.isVerifying2FA}
                  >
                    <FiArrowLeft aria-hidden="true" /> {MESSAGES.BACK_TO_LOGIN}
                  </button>
                </p>
              </form>
            </Card>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <LoginForm
        formData={state.formData}
        isLoading={ui.isLoading}
        isGoogleLoading={ui.isGoogleLoading}
        errorMessage={ui.errorMessage}
        onChange={actions.handleChange}
        onSubmit={actions.handleSubmit}
        onGoogleSuccess={actions.handleGoogleSuccess}
        onGoogleError={actions.handleGoogleError}
      />
    </PublicLayout>
  );
}

export default Login;
 