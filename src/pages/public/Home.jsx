import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import SolutionCard from '../../components/common/card/SolutionCard';
import SearchPanel from '../../components/common/search/SearchPanel';
import { MESSAGES, ROUTES } from '../../constants';
import imagenInicio from '../../assets/imagenInicio.png';
import './PublicPages.css';

function Home() {
  const navigate = useNavigate();
  
  const solutions = [
    { title: MESSAGES.SMART_BOOKING, description: MESSAGES.SMART_BOOKING_DESC },
    { title: MESSAGES.SECURITY, description: MESSAGES.SECURITY_DESC },
    { title: MESSAGES.CLEAR_PRICES, description: MESSAGES.CLEAR_PRICES_DESC },
    { title: MESSAGES.EXPERT_SUPPORT, description: MESSAGES.EXPERT_SUPPORT_DESC }
  ];

  const handleSearch = useCallback((criteria) => {
    navigate(ROUTES.CATALOG, { state: { criteria } });
  }, [navigate]);

  return (
    <PublicLayout>
      <div className="home">
        <section className="hero" style={{ backgroundImage: `url(${imagenInicio})` }}>
          <div className="hero-overlay"></div>
          <div className="hero-wrapper">
            <div className="hero-content">
              <div className="hero-search">
                <SearchPanel onSearch={handleSearch} variant="hero" />
              </div>
            </div>
          </div>
        </section>

        <section className="solutions">
          <div className="solutions-container">
            <div className="solutions-header">
              <span className="solutions-label">Ventajas RentExpress</span>
              <h2>Soluciones para cada viaje</h2>
              <p>Descubre cómo nuestras categorías cubren cada necesidad de movilidad.</p>
            </div>
            <div className="solutions-grid">
              {solutions.map((solution, index) => (
                <SolutionCard 
                  key={index}
                  title={solution.title}
                  description={solution.description}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

export default Home;
