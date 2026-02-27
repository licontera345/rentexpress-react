import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useHeaderProps } from '../../hooks/index.js';

/**
 * Layout público: skip-link, Header (con props del hook), main, Footer.
 */
export function PublicLayout({
  children,
  skipToContentLabel = 'Ir al contenido',
  ...footerProps
}) {
  const headerProps = useHeaderProps();

  return (
    <div className="public-layout">
      <a className="skip-link" href="#main-content">
        {skipToContentLabel}
      </a>
      <Header {...headerProps} />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer {...footerProps} />
    </div>
  );
}

export default PublicLayout;
