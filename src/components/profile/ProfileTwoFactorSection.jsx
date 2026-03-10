import { useState, useCallback } from 'react';
import { useAuth } from '../../hooks/core/useAuth';
import { resolveUserId } from '../../utils/ui/uiUtils';
import UserService from '../../api/services/userService';
import { Card } from '../common/layout/LayoutPrimitives';
import Button from '../common/actions/Button';
import FormField from '../common/forms/FormField';
import { BUTTON_VARIANTS, MESSAGES } from '../../constants';
import { getApiErrorMessage } from '../../utils/ui/uiUtils';

export default function ProfileTwoFactorSection() {
  const { user, updateUser } = useAuth();
  const userId = resolveUserId(user);
  const twoFactorEnabled = Boolean(user?.twoFactorEnabled);

  const [setupSecret, setSetupSecret] = useState(null);
  const [confirmCode, setConfirmCode] = useState('');
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleActivateClick = useCallback(async () => {
    if (!userId) return;
    setError('');
    setStatusMessage('');
    setLoading(true);
    try {
      const data = await UserService.setup2FA(userId);
      setSetupSecret(data?.secret ?? null);
    } catch (e) {
      setError(getApiErrorMessage(e, 'UNEXPECTED_ERROR'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleConfirmSetup = useCallback(async (e) => {
    e.preventDefault();
    if (!userId || !setupSecret || !confirmCode.trim()) return;
    setError('');
    setLoading(true);
    try {
      await UserService.confirm2FA(userId, { secret: setupSecret, code: confirmCode.trim() });
      updateUser({ twoFactorEnabled: true });
      setSetupSecret(null);
      setConfirmCode('');
      setStatusMessage(MESSAGES.TWO_FACTOR_ACTIVATED_SUCCESS);
    } catch (e) {
      setError(getApiErrorMessage(e, 'AUTH_ERROR_2FA_VERIFY'));
    } finally {
      setLoading(false);
    }
  }, [userId, setupSecret, confirmCode, updateUser]);

  const handleCancelSetup = useCallback(() => {
    setSetupSecret(null);
    setConfirmCode('');
    setError('');
  }, []);

  const handleDisableClick = useCallback(() => {
    setShowDisableForm(true);
    setDisablePassword('');
    setError('');
    setStatusMessage('');
  }, []);

  const handleDisableSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!userId || !disablePassword) return;
    setError('');
    setLoading(true);
    try {
      await UserService.disable2FA(userId, { password: disablePassword });
      updateUser({ twoFactorEnabled: false });
      setDisablePassword('');
      setShowDisableForm(false);
      setStatusMessage(MESSAGES.TWO_FACTOR_DISABLED_SUCCESS);
    } catch (e) {
      setError(getApiErrorMessage(e, 'UNEXPECTED_ERROR'));
    } finally {
      setLoading(false);
    }
  }, [userId, disablePassword, updateUser]);

  if (!userId) return null;

  return (
    <Card className="personal-space-card personal-space-card--profile profile-2fa-card">
      <h3>{MESSAGES.TWO_FACTOR_SECTION_TITLE}</h3>
      {statusMessage && <p className="profile-status-message success">{statusMessage}</p>}
      {error && <p className="profile-error" role="alert">{error}</p>}

      {twoFactorEnabled && (
        <>
          <p>{MESSAGES.TWO_FACTOR_ENABLED}</p>
          {!showDisableForm ? (
            <Button
              type="button"
              variant={BUTTON_VARIANTS.DANGER}
              onClick={handleDisableClick}
              disabled={loading}
            >
              {MESSAGES.TWO_FACTOR_DISABLE}
            </Button>
          ) : (
            <form onSubmit={handleDisableSubmit} className="profile-2fa-form" style={{ marginTop: '0.5rem' }}>
              <FormField
                label={MESSAGES.TWO_FACTOR_DISABLE_PASSWORD}
                type="password"
                name="disable2faPassword"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                required
                disabled={loading}
              />
              <div className="profile-2fa-actions">
                <Button type="submit" variant={BUTTON_VARIANTS.DANGER} disabled={loading}>
                  {loading ? MESSAGES.STARTING : MESSAGES.TWO_FACTOR_DISABLE}
                </Button>
                <Button type="button" variant={BUTTON_VARIANTS.OUTLINED} onClick={() => setShowDisableForm(false)} disabled={loading}>
                  {MESSAGES.CANCEL}
                </Button>
              </div>
            </form>
          )}
        </>
      )}

      {!twoFactorEnabled && !setupSecret && (
        <>
          <p>{MESSAGES.TWO_FACTOR_DISABLED}</p>
          <Button
            type="button"
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={handleActivateClick}
            disabled={loading}
          >
            {loading ? MESSAGES.STARTING : MESSAGES.TWO_FACTOR_ACTIVATE}
          </Button>
        </>
      )}

      {!twoFactorEnabled && setupSecret && (
        <div className="profile-2fa-setup">
          <p>{MESSAGES.TWO_FACTOR_SETUP_INSTRUCTIONS}</p>
          <FormField
            label={MESSAGES.TWO_FACTOR_SECRET_LABEL}
            type="text"
            readOnly
            value={setupSecret}
            disabled
          />
          <form onSubmit={handleConfirmSetup} className="profile-2fa-form">
            <FormField
              label={MESSAGES.TWO_FACTOR_CONFIRM_CODE}
              type="text"
              name="confirmCode"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              placeholder={MESSAGES.TWO_FACTOR_CODE_PLACEHOLDER}
              inputMode="numeric"
              maxLength={6}
              required
              disabled={loading}
            />
            <div className="profile-2fa-actions">
              <Button type="submit" disabled={loading || confirmCode.trim().length < 6}>
                {loading ? MESSAGES.STARTING : MESSAGES.TWO_FACTOR_VERIFY}
              </Button>
              <Button type="button" variant={BUTTON_VARIANTS.OUTLINED} onClick={handleCancelSetup} disabled={loading}>
                {MESSAGES.CANCEL}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}
