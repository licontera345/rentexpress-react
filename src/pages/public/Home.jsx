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
import imagenInicio from '../../assets/imagenInicio.png';
import { ROUTES } from '../../constants';

// Componente Home que encapsula la interfaz y la lógica principal de esta sección.

function Home() {
  const navigate = useNavigate();

  const handleSearch = (criteria) => {
    navigate(ROUTES.CATALOG, { state: { criteria } });
  };

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
