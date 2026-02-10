import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

const usePublicHomePage = () => {
  const navigate = useNavigate();

  const handleSearch = useCallback((criteria) => {
    navigate(ROUTES.CATALOG, { state: { criteria } });
  }, [navigate]);

  return {
    state: {},
    ui: {},
    actions: {
      handleSearch
    },
    meta: {}
  };
};

export default usePublicHomePage;
