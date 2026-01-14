import Header from '../../common/Header';
import Footer from '../../common/Footer';

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
