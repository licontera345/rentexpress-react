import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import HomeAdvantagesSection from '../../components/home/sections/HomeAdvantagesSection';
import HomeFaqSection from '../../components/home/sections/HomeFaqSection';
import HomeHeroSection from '../../components/home/sections/HomeHeroSection';
import HomeRequirementsSection from '../../components/home/sections/HomeRequirementsSection';
import HomeReviewsSection from '../../components/home/sections/HomeReviewsSection';
import HomeStatsSection from '../../components/home/sections/HomeStatsSection';
import HomeTipsSection from '../../components/home/sections/HomeTipsSection';
import HomeTrustSection from '../../components/home/sections/HomeTrustSection';
import { ROUTES } from '../../constants';
import imagenInicio from '../../assets/imagenInicio.png';

// Página principal que agrupa secciones de marketing y búsqueda inicial. Coordina el acceso al catálogo.
function Home() {
  const navigate = useNavigate();
  const handleSearch = useCallback((criteria) => {
    navigate(ROUTES.CATALOG, { state: { criteria } });
  }, [navigate]);

  return (
    <PublicLayout>
      <div className="home">
        <HomeHeroSection backgroundImage={imagenInicio} onSearch={handleSearch} />
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
