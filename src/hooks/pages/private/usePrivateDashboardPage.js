import { useAuth } from '../../auth/useAuth';
import { MESSAGES } from '../../../constants';

const usePrivateDashboardPage = () => {
  const { user, isEmployee } = useAuth();
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;

  return {
    state: {
      displayName,
      title: isEmployee ? MESSAGES.DASHBOARD_TITLE_EMPLOYEE : MESSAGES.DASHBOARD_TITLE_CUSTOMER,
      subtitle: isEmployee ? MESSAGES.DASHBOARD_SUBTITLE_EMPLOYEE : MESSAGES.DASHBOARD_SUBTITLE_CUSTOMER
    },
    ui: {},
    actions: {},
    meta: {}
  };
};

export default usePrivateDashboardPage;
