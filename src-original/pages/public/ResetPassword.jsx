import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/forms/FormField';
import Button from '../../components/common/actions/Button';
import { Card } from '../../components/common/layout/LayoutPrimitives';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../../constants';
import useResetPasswordPage from '../../hooks/public/useResetPasswordPage';

function ResetPassword() {
  const { state, ui, actions } = useResetPasswordPage();

  return (
    <PublicLayout>
      <div className="login-container">
        <div className="login-wrapper">
          <Card className="login-card">
            <div className="login-header">
              <h1>{MESSAGES.RESET_PASSWORD_TITLE}</h1>
              <p className="login-subtitle">{MESSAGES.RESET_PASSWORD_SUBTITLE}</p>
            </div>

            {ui.success ? (
              <div className="forgot-password-success">
                <p>{MESSAGES.RESET_PASSWORD_SUCCESS}</p>
                <Button
                  variant={BUTTON_VARIANTS.PRIMARY}
                  size="large"
                  onClick={actions.goToLogin}
                >
                  {MESSAGES.FORGOT_PASSWORD_BACK_LOGIN}
                </Button>
              </div>
            ) : !state.hasValidToken ? (
              <div className="forgot-password-success">
                <p>{MESSAGES.RESET_PASSWORD_INVALID_TOKEN}</p>
                <Button
                  variant={BUTTON_VARIANTS.PRIMARY}
                  size="large"
                  onClick={actions.goToForgotPassword}
                >
                  {MESSAGES.FORGOT_PASSWORD_TITLE}
                </Button>
                <p style={{ marginTop: '1rem' }}>
                  <Link to={ROUTES.LOGIN}>{MESSAGES.FORGOT_PASSWORD_BACK_LOGIN}</Link>
                </p>
              </div>
            ) : (
              <form onSubmit={actions.handleSubmit} className="login-form">
                <FormField
                  label={MESSAGES.RESET_PASSWORD_LABEL}
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={actions.handleChange}
                  required
                  minLength={6}
                  disabled={ui.isLoading}
                />
                <FormField
                  label={MESSAGES.RESET_PASSWORD_CONFIRM_LABEL}
                  type="password"
                  name="confirmPassword"
                  value={state.confirmPassword}
                  onChange={actions.handleChange}
                  required
                  minLength={6}
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
                  {ui.isLoading ? MESSAGES.LOADING : MESSAGES.RESET_PASSWORD_SUBMIT}
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

export default ResetPassword;
