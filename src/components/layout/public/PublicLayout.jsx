import Header from '../../common/Header';
import Footer from '../../common/Footer';
import './PublicLayout.css';

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
