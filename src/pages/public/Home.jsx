import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import SearchPanel from '../../components/common/search/SearchPanel';
import SolutionCard from '../../components/common/card/SolutionCard';
import useVehicleSearch from '../../hooks/useVehicleSearch';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { searchVehicles } = useVehicleSearch();
  
  const solutions = [
    { title: 'Reserva inteligente', description: 'Filtra por categoría, sede y disponibilidad en tiempo real.' },
    { title: 'Seguridad en cada paso', description: 'Autenticación reforzada, pagos seguros.' },
    { title: 'Precios claros', description: 'Tarifas sin costos ocultos.' },
    { title: 'Acompañamiento experto', description: 'Un equipo especial que te acompaña.' }
  ];

  const handleSearch = useCallback(async (criteria) => {
    await searchVehicles(criteria).catch(() => {});
    navigate('/catalog');
  }, [searchVehicles, navigate]);

  return (
    <PublicLayout>
      <div className="home">
        <section className="hero">
          <div className="hero-wrapper">
            <div className="hero-search">
              <SearchPanel onSearch={handleSearch} />
            </div>
          </div>
        </section>

        <section className="solutions">
          <div className="solutions-container">
            <div className="solutions-header">
              <h2>Soluciones para cada viaje</h2>
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
