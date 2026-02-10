import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

const usePublicNotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  const handleGoCatalog = useCallback(() => {
    navigate(ROUTES.CATALOG);
  }, [navigate]);

  return {
    state: {},
    ui: {},
    actions: {
      handleGoHome,
      handleGoCatalog
    },
    meta: {}
  };
};

export default usePublicNotFoundPage;
