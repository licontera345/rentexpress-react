import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/actions/Button';
import PublicLayout from '../../components/layout/public/PublicLayout';
import { ROUTES, BUTTON_VARIANTS } from '../../constants';
import { MESSAGES } from '../../constants/messages';

function NotFound() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">{MESSAGES.NOT_FOUND_TITLE}</h1>
          <div className="not-found-icon">🚗</div>
          <p className="not-found-description">
            {MESSAGES.NOT_FOUND_DESCRIPTION}
          </p>
          <div className="not-found-actions">
            <Button 
              variant={BUTTON_VARIANTS.PRIMARY} 
              size="large"
              onClick={() => navigate(ROUTES.HOME)}
            >
              {MESSAGES.NOT_FOUND_BACK_HOME}
            </Button>
            <Button 
              variant={BUTTON_VARIANTS.SECONDARY} 
              size="large"
              onClick={() => navigate(ROUTES.CATALOG)}
            >
              {MESSAGES.NOT_FOUND_VIEW_CATALOG}
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default NotFound;
