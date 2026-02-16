import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MESSAGES, ROUTES, THEME, USER_ROLES } from '../../constants';
import { setLocale } from '../../i18n';
import useTheme from '../core/useTheme';
import { useAuth } from '../core/useAuth';
import useProfileImage from '../profile/useProfileImage';
import {
  getThemeLabel,
  getLocaleMetadata,
  getUserDisplayName,
  getUserRoleLabel,
  resolveUserId,
  LOCALE_METADATA
} from '../../utils/uiUtils';
import { availableLocales } from '../../i18n';

/**
 * Hook con la lógica del Header: tema, auth, perfil, locale.
 * Los layouts llaman este hook y pasan el resultado al componente presentacional Header.
 */
function useHeader() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, role, logout } = useAuth();
  const locale = i18n.language;

  const userEntityId = resolveUserId(user);
  const { imageSrc: profileImageSrc } = useProfileImage({
    entityType: role === USER_ROLES.EMPLOYEE ? 'employee' : 'user',
    entityId: userEntityId,
    refreshKey: userEntityId ?? 0
  });

  const handleLocaleChange = useCallback((event) => {
    setLocale(event.target.value);
  }, []);

  const handleLogout = useCallback(() => {
    const shouldLogout = window.confirm(MESSAGES.CONFIRM_LOGOUT);
    if (!shouldLogout) return;
    logout();
    navigate(ROUTES.HOME);
  }, [logout, navigate]);

  return {
    theme,
    themeLabel: getThemeLabel(theme),
    toggleTheme,
    isAuthenticated,
    user,
    role,
    logout,
    profileImageSrc,
    displayName: getUserDisplayName(user),
    roleLabel: getUserRoleLabel(role),
    locale,
    currentLocale: getLocaleMetadata(locale),
    availableLocales,
    localeMetadata: LOCALE_METADATA,
    handleLocaleChange,
    handleLogout,
    navigate,
    t
  };
}

export default useHeader;
