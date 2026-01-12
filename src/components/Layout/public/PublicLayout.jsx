import { Outlet } from 'react-router-dom'
import Header from '../../header/Header'
import Footer from '../../footer/Footer'

function PublicLayout() {
  return (
    <>
      <Header />
      <main className="main-full-width">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default PublicLayout;
