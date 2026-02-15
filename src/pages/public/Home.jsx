import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import {
  HomeAdvantagesSection,
  HomeFaqSection,
  HomeHeroSection,
  HomeRequirementsSection,
  HomeReviewsSection,
  HomeStatsSection,
  HomeTipsSection,
  HomeTrustSection,
} from '../../components/home/HomeSections';
import { ROUTES } from '../../constants';
import imagenInicio from '../../assets/imagenInicio.png';

// Página principal que agrupa secciones de marketing y búsqueda inicial. Coordina el acceso al catálogo.
function Home() {
  const navigate = useNavigate();
  const homeRef = useRef(null);

  const handleSearch = useCallback((criteria) => {
    navigate(ROUTES.CATALOG, { state: { criteria } });
  }, [navigate]);

  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;
    const sections = el.querySelectorAll('section[class^="home-"]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <PublicLayout>
      <div className="home" ref={homeRef}>
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
