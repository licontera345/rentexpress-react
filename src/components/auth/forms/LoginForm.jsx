import { Link } from 'react-router-dom';
import { MESSAGES, ROUTES, BUTTON_VARIANTS, USER_ROLES } from '../../../constants';
import { FiBriefcase, FiLogIn, FiUser } from 'react-icons/fi';
import FormField from '../../common/forms/FormField';
import Button from '../../common/actions/Button';
import { Card } from '../../common/layout/LayoutPrimitives';

// Componente LoginForm que define la interfaz y organiza la lógica de esta vista.

function LoginForm({ formData, isLoading, errorMessage, onChange, onSubmit }) {
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <div className="login-header">
            <h1>{MESSAGES.LOGIN_TITLE}</h1>
            <p className="login-subtitle">{MESSAGES.LOGIN_SUBTITLE}</p>
          </div>

          <form onSubmit={onSubmit} className="login-form">
            <div className="login-role">
              <span className="login-role-label">{MESSAGES.ACCOUNT_TYPE}</span>
              <p className="login-role-help">{MESSAGES.LOGIN_HELP_TEXT}</p>
              <div className="login-role-options" role="radiogroup" aria-label={MESSAGES.ACCOUNT_TYPE}>
                <label className={`login-role-option ${formData.role === USER_ROLES.CUSTOMER ? 'is-active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={USER_ROLES.CUSTOMER}
                    checked={formData.role === USER_ROLES.CUSTOMER}
                    onChange={onChange}
                    disabled={isLoading}
                  />
                  <FiUser aria-hidden="true" />
                  <span>{MESSAGES.CUSTOMER_ROLE}</span>
                </label>
                <label className={`login-role-option ${formData.role === USER_ROLES.EMPLOYEE ? 'is-active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={USER_ROLES.EMPLOYEE}
                    checked={formData.role === USER_ROLES.EMPLOYEE}
                    onChange={onChange}
                    disabled={isLoading}
                  />
                  <FiBriefcase aria-hidden="true" />
                  <span>{MESSAGES.EMPLOYEE_ROLE}</span>
                </label>
              </div>
            </div>

            <FormField
              label={MESSAGES.USERNAME}
              type="text"
              name="username"
              value={formData.username}
              onChange={onChange}
              placeholder={MESSAGES.USERNAME_PLACEHOLDER}
              required
              disabled={isLoading}
            />

            <FormField
              label={MESSAGES.PASSWORD}
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder={MESSAGES.PASSWORD_PLACEHOLDER}
              required
              disabled={isLoading}
            />

            <div className="login-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={onChange}
                  disabled={isLoading}
                />
                <span>{MESSAGES.REMEMBER_ME}</span>
              </label>
              <p className="login-forgot">
                <Link to={ROUTES.FORGOT_PASSWORD}>{MESSAGES.FORGOT_PASSWORD_LINK}</Link>
              </p>
            </div>

            {errorMessage && (
              <p className="login-error" role="alert">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant={BUTTON_VARIANTS.PRIMARY}
              size="large"
              className="login-submit"
              disabled={isLoading}
            >
              <FiLogIn aria-hidden="true" />
              {isLoading ? MESSAGES.STARTING : MESSAGES.SIGN_IN}
            </Button>
          </form>

          <div className="login-footer">
            <p>
              {MESSAGES.NO_ACCOUNT} <Link to={ROUTES.REGISTER}>{MESSAGES.SIGN_UP_HERE}</Link>
            </p>
            <p className="login-support">{MESSAGES.SUPPORT_HINT}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginForm;
