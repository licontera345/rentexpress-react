import Header from '../../common/layout/Header';
import Footer from '../../common/layout/Footer';
import useHeader from '../../../hooks/layout/useHeader';
import { MESSAGES } from '../../../constants';

function PublicLayout({ children }) {
  const headerProps = useHeader();
  return (
    <div className="public-layout">
      <a className="skip-link" href="#main-content">
        {MESSAGES.SKIP_TO_CONTENT}
      </a>
      <Header {...headerProps} />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
