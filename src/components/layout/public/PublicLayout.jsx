import Header from '../../common/layout/Header';
import Footer from '../../common/layout/Footer';
import { MESSAGES } from '../../../constants';

// Componente Public Layout que encapsula la interfaz y la lógica principal de esta sección.

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <a className="skip-link" href="#main-content">
        {MESSAGES.SKIP_TO_CONTENT}
      </a>
      <Header />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
