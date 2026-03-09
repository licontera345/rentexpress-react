import { useMemo } from 'react';
import { useAuth } from '../core/useAuth';
import { useProfileMessage } from '../core/useProfileMessage';
import { MESSAGES, ROUTES, USER_ROLES } from '../../constants';
import { getMenuItems } from '../../utils/ui/uiUtils';

export function usePrivateDashboardPage() {
  const { user, role } = useAuth();
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;
  const title = useProfileMessage('DASHBOARD_TITLE');
  const subtitle = useProfileMessage('DASHBOARD_SUBTITLE');
  const showEmployeeDashboard = role === USER_ROLES.EMPLOYEE || role === USER_ROLES.ADMIN;
  const quickActions = showEmployeeDashboard
    ? [
        {
          title: MESSAGES.DASHBOARD_ACTION_VEHICLES,
          description: MESSAGES.DASHBOARD_ACTION_VEHICLES_DESC,
          route: ROUTES.VEHICLE_LIST,
          cta: MESSAGES.NAV_VEHICLES,
        },
        {
          title: MESSAGES.DASHBOARD_ACTION_RESERVATIONS,
          description: MESSAGES.DASHBOARD_ACTION_RESERVATIONS_DESC,
          route: ROUTES.RESERVATIONS_LIST,
          cta: MESSAGES.NAV_RESERVATIONS,
        },
        {
          title: MESSAGES.DASHBOARD_ACTION_CLIENTS,
          description: MESSAGES.DASHBOARD_ACTION_CLIENTS_DESC,
          route: ROUTES.CLIENT_LIST,
          cta: MESSAGES.NAV_CLIENTS,
        },
      ]
    : [
        {
          title: MESSAGES.DASHBOARD_ACTION_NEW_RESERVATION,
          description: MESSAGES.DASHBOARD_ACTION_NEW_RESERVATION_DESC,
          route: ROUTES.RESERVATION_CREATE,
          cta: MESSAGES.DASHBOARD_ACTION_START,
        },
        {
          title: MESSAGES.DASHBOARD_ACTION_MY_RESERVATIONS,
          description: MESSAGES.DASHBOARD_ACTION_MY_RESERVATIONS_DESC,
          route: ROUTES.MY_RESERVATIONS,
          cta: MESSAGES.DASHBOARD_ACTION_MY_RESERVATIONS,
        },
        {
          title: MESSAGES.DASHBOARD_ACTION_MY_RENTALS,
          description: MESSAGES.DASHBOARD_ACTION_MY_RENTALS_DESC,
          route: ROUTES.MY_RENTALS,
          cta: MESSAGES.DASHBOARD_ACTION_MY_RENTALS,
        },
      ];

  return {
    state: {
      isEmployee: showEmployeeDashboard,
      displayName,
      title,
      subtitle,
      quickActions,
    },
    ui: {},
    actions: {},
    options: {},
  };
}

export function usePrivateLayout() {
  const { role } = useAuth();
  const isEmployee = role === USER_ROLES.EMPLOYEE || role === USER_ROLES.ADMIN;
  const menuItems = useMemo(() => getMenuItems(isEmployee), [isEmployee]);
  return { menuItems };
}
