import Header from '../../common/Header.jsx';
import Footer from '../../common/Footer.jsx';

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default PublicLayout;
