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
import useSearchPanel from '../../hooks/public/useSearchPanel';
import { ROUTES } from '../../constants';

// Fondo del hero (section.hero + div.hero-overlay): coche rojo, Unsplash.
const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1920&q=85';

function Home() {
  const navigate = useNavigate();
  const homeRef = useRef(null);

  const handleSearch = useCallback((criteria) => {
    navigate(ROUTES.CATALOG, { state: { criteria } });
  }, [navigate]);

  const searchPanelProps = useSearchPanel(null, handleSearch, 'hero', '');

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
        <HomeHeroSection backgroundImage={HERO_IMAGE_URL} searchPanelProps={searchPanelProps} />
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
