import PublicLayout from '../../components/layout/public/PublicLayout';
import HomeAdvantagesSection from '../../components/home/HomeAdvantagesSection';
import HomeFaqSection from '../../components/home/HomeFaqSection';
import HomeHeroSection from '../../components/home/HomeHeroSection';
import HomeRequirementsSection from '../../components/home/HomeRequirementsSection';
import HomeReviewsSection from '../../components/home/HomeReviewsSection';
import HomeStatsSection from '../../components/home/HomeStatsSection';
import HomeTipsSection from '../../components/home/HomeTipsSection';
import HomeTrustSection from '../../components/home/HomeTrustSection';
import imagenInicio from '../../assets/imagenInicio.png';
import useHomePage from '../../hooks/useHomePage';

function Home() {
  const { handleSearch } = useHomePage();

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
