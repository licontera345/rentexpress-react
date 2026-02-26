import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../../constants';
import Button from './actions/Button';

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    this.props.navigate?.(ROUTES.HOME);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">{MESSAGES.ERROR_BOUNDARY_TITLE}</h1>
            <p className="error-boundary-description">{MESSAGES.ERROR_BOUNDARY_DESCRIPTION}</p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="error-boundary-details">{this.state.error.message}</pre>
            )}
            <div className="error-boundary-actions">
              <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={this.handleRetry}>
                {MESSAGES.ERROR_BOUNDARY_TRY_AGAIN}
              </Button>
              <Button variant={BUTTON_VARIANTS.SECONDARY} onClick={this.handleGoHome}>
                {MESSAGES.ERROR_BOUNDARY_GO_HOME}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ErrorBoundary({ children }) {
  const navigate = useNavigate();
  return (
    <ErrorBoundaryClass navigate={navigate}>
      {children}
    </ErrorBoundaryClass>
  );
}

export default ErrorBoundary;
