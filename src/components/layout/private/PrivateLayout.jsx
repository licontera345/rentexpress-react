import Header from '../../common/Header';
import Footer from '../../common/Footer';
import './PrivateLayout.css';

function PrivateLayout({ children }) {
  return (
    <div className="private-layout">
      <Header />
      <main className="private-main">
        <div className="private-container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrivateLayout;
