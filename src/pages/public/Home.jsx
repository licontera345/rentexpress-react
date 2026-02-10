import PublicLayout from '../../components/layout/public/PublicLayout';
import HomeAdvantagesSection from '../../components/home/sections/HomeAdvantagesSection';
import HomeFaqSection from '../../components/home/sections/HomeFaqSection';
import HomeHeroSection from '../../components/home/sections/HomeHeroSection';
import HomeRequirementsSection from '../../components/home/sections/HomeRequirementsSection';
import HomeReviewsSection from '../../components/home/sections/HomeReviewsSection';
import HomeStatsSection from '../../components/home/sections/HomeStatsSection';
import HomeTipsSection from '../../components/home/sections/HomeTipsSection';
import HomeTrustSection from '../../components/home/sections/HomeTrustSection';
import imagenInicio from '../../assets/imagenInicio.png';
import usePublicHomePage from '../../hooks/usePublicHomePage';

// Página principal que agrupa secciones de marketing y búsqueda inicial. Coordina el acceso al catálogo.
function Home() {
  const { actions } = usePublicHomePage();

  return (
    <PublicLayout>
      {/* Contenedor con todas las secciones visibles del home */}
      <div className="home">
        <HomeHeroSection backgroundImage={imagenInicio} onSearch={actions.handleSearch} />
        <HomeReviewsSection />
        <HomeAdvantagesSection />
        <HomeTrustSection />
        <HomeStatsSection />
        <HomeTipsSection />
        <HomeRequirementsSection />
        <HomeFaqSection />
      </div>
    </PublicLayout>
  );
}

export default Home;
