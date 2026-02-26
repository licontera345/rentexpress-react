import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/forms/FormField';
import Button from '../../components/common/actions/Button';
import { Card } from '../../components/common/layout/LayoutPrimitives';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../../constants';
import useForgotPasswordPage from '../../hooks/public/useForgotPasswordPage';

function ForgotPassword() {
  const { state, ui, actions } = useForgotPasswordPage();

  return (
    <PublicLayout>
      <div className="login-container">
        <div className="login-wrapper">
          <Card className="login-card">
            <div className="login-header">
              <h1>{MESSAGES.FORGOT_PASSWORD_TITLE}</h1>
              <p className="login-subtitle">{MESSAGES.FORGOT_PASSWORD_SUBTITLE}</p>
            </div>

            {ui.success ? (
              <div className="forgot-password-success">
                <p>{MESSAGES.FORGOT_PASSWORD_SUCCESS}</p>
                <Button
                  variant={BUTTON_VARIANTS.PRIMARY}
                  size="large"
                  onClick={actions.goToLogin}
                >
                  {MESSAGES.FORGOT_PASSWORD_BACK_LOGIN}
                </Button>
              </div>
            ) : (
              <form onSubmit={actions.handleSubmit} className="login-form">
                <FormField
                  label={MESSAGES.FORGOT_PASSWORD_EMAIL_LABEL}
                  type="email"
                  name="email"
                  value={state.email}
                  onChange={actions.handleChange}
                  placeholder={MESSAGES.EMAIL_PLACEHOLDER}
                  required
                  disabled={ui.isLoading}
                />
                {ui.errorMessage && (
                  <p className="login-error" role="alert">
                    {ui.errorMessage}
                  </p>
                )}
                <Button
                  type="submit"
                  variant={BUTTON_VARIANTS.PRIMARY}
                  size="large"
                  className="login-submit"
                  disabled={ui.isLoading}
                >
                  {ui.isLoading ? MESSAGES.LOADING : MESSAGES.FORGOT_PASSWORD_SEND}
                </Button>
              </form>
            )}

            <div className="login-footer">
              <p>
                <Link to={ROUTES.LOGIN}>{MESSAGES.FORGOT_PASSWORD_BACK_LOGIN}</Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

export default ForgotPassword;
