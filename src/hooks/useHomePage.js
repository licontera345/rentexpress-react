import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { MESSAGES } from '../constants/messages';

const useHomePage = () => {
  const navigate = useNavigate();

  const solutions = useMemo(() => ([
    { title: MESSAGES.SMART_BOOKING, description: MESSAGES.SMART_BOOKING_DESC },
    { title: MESSAGES.SECURITY, description: MESSAGES.SECURITY_DESC },
    { title: MESSAGES.CLEAR_PRICES, description: MESSAGES.CLEAR_PRICES_DESC },
    { title: MESSAGES.EXPERT_SUPPORT, description: MESSAGES.EXPERT_SUPPORT_DESC }
  ]), []);

  const handleSearch = useCallback((criteria) => {
    navigate(ROUTES.CATALOG, { state: { criteria } });
  }, [navigate]);

  return {
    solutions,
    handleSearch
  };
};

export default useHomePage;
