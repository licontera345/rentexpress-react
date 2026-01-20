import PublicLayout from '../../components/layout/public/PublicLayout';
import SolutionCard from '../../components/common/card/SolutionCard';
import SearchPanel from '../../components/common/search/SearchPanel';
import { MESSAGES } from '../../constants';
import imagenInicio from '../../assets/imagenInicio.png';
import useHomePage from '../../hooks/useHomePage';

function Home() {
  const { solutions, handleSearch } = useHomePage();

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

        <section className="home-reviews">
          <div className="home-section">
            <div className="home-section-header">
              <h2>Altamente recomendados por nuestros clientes</h2>
              <p>Historias reales de personas que reservaron con RentExpress.</p>
            </div>
            <div className="review-grid">
              {[
                {
                  title: 'Buen servicio y atención',
                  text: 'El proceso fue rápido y el auto estaba impecable.',
                  author: 'Caleb Nunez Pereda',
                  date: '20 ene 2026',
                },
                {
                  title: 'BIEN, RAPIDO Y COMODO',
                  text: 'Reserva sencilla desde el celular y sin sorpresas.',
                  author: 'FB',
                  date: '20 ene 2026',
                },
                {
                  title: 'Buen precio y seguro',
                  text: 'Encontré tarifas mejores que en otros sitios.',
                  author: 'Óscar Muñoz Vedia',
                  date: '20 ene 2026',
                },
                {
                  title: 'Buena experiencia con RentExpress',
                  text: 'Atención clara y soporte en todo el viaje.',
                  author: 'Candelaria Rodriguez',
                  date: '20 ene 2026',
                },
              ].map((review, index) => (
                <article className="review-card" key={index}>
                  <div className="review-stars" aria-label="5 estrellas">
                    {'★★★★★'}
                  </div>
                  <h3>{review.title}</h3>
                  <p>{review.text}</p>
                  <div className="review-meta">
                    <span>{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="review-footer">
              <span>Valoración 4,6 / 5 basada en 250.909 opiniones.</span>
              <strong>Mostrando nuestras opiniones favoritas.</strong>
            </div>
          </div>
        </section>

        <section className="home-advantages">
          <div className="home-section">
            <div className="home-section-header">
              <h2>Nosotros comparamos los precios de alquiler de coches, usted ahorra el dinero</h2>
              <p>Más transparencia, más opciones y mejor asistencia.</p>
            </div>
            <div className="advantage-grid">
              <article className="advantage-card">
                <h3>Encuentre el coche perfecto para su viaje</h3>
                <p>
                  RentExpress reúne ofertas de diferentes proveedores para que elijas el auto ideal
                  para cada destino. Todo con tasas claras y sin costos ocultos.
                </p>
              </article>
              <article className="advantage-card advantage-highlight">
                <h3>¿Por qué reservar con nosotros?</h3>
                <ul>
                  <li>Sin costos ocultos</li>
                  <li>Atención al cliente multilingüe 24/7</li>
                  <li>Cancelación gratuita</li>
                  <li>Información confiable en cada paso</li>
                </ul>
              </article>
              <article className="advantage-card advantage-callout">
                <h3>¿Por qué nuestros precios son más bajos?</h3>
                <p>
                  Negociamos tarifas con múltiples compañías de alquiler para asegurar los precios
                  más competitivos. Así puedes ahorrar sin renunciar a la calidad.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="home-trust">
          <div className="home-section trust-grid">
            <div className="trust-intro">
              <h2>Recomendado por los clientes</h2>
              <p>
                Los comentarios de nuestros clientes nos ayudan a mejorar constantemente el servicio
                y mantener los estándares de calidad.
              </p>
            </div>
            <div className="trust-cards">
              {[
                { label: 'Trustpilot', rating: '4,6' },
                { label: 'Google', rating: '4,5' },
                { label: 'Review Centre', rating: '4,2' },
                { label: 'Reviews.io', rating: '4,4' },
              ].map((item) => (
                <div className="trust-card" key={item.label}>
                  <strong>{item.rating}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-stats">
          <div className="home-section stats-grid">
            {[
              { value: '164', label: 'países' },
              { value: '50 000+', label: 'localidades' },
              { value: '1000+', label: 'socios' },
              { value: '33', label: 'idiomas' },
            ].map((stat) => (
              <div className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="home-tips">
          <div className="home-section">
            <div className="home-section-header">
              <h2>Cómo encontrar una gran oferta de alquiler de coche</h2>
              <p>Recomendaciones para conseguir la tarifa más baja.</p>
            </div>
            <div className="tips-grid">
              {[
                {
                  title: 'Reserve con antelación',
                  text: 'Asegure mejores precios reservando antes de la fecha del viaje.',
                },
                {
                  title: 'Lea los comentarios',
                  text: 'Revise valoraciones y experiencias de otros usuarios.',
                },
                {
                  title: 'Recuerde la fianza',
                  text: 'Compruebe el importe de la fianza antes de viajar.',
                },
                {
                  title: 'Revise políticas de combustible',
                  text: 'Evite cargos extra revisando el kilometraje y combustible.',
                },
              ].map((tip) => (
                <article className="tip-card" key={tip.title}>
                  <h3>{tip.title}</h3>
                  <p>{tip.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-requirements">
          <div className="home-section">
            <div className="home-section-header">
              <h2>¿Qué necesita para recoger el coche?</h2>
              <p>Documentación y requisitos esenciales.</p>
            </div>
            <div className="requirements-grid">
              {[
                {
                  title: 'Carnet de conducir',
                  text: 'Licencia válida a nombre del conductor principal.',
                },
                {
                  title: 'Documento de identidad',
                  text: 'Pasaporte o documento oficial vigente.',
                },
                {
                  title: 'Tarjeta de crédito',
                  text: 'A nombre del conductor principal para la fianza.',
                },
                {
                  title: 'Vale',
                  text: 'Voucher impreso o electrónico si está disponible.',
                },
              ].map((item) => (
                <article className="requirement-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-faq">
          <div className="home-section">
            <div className="home-section-header">
              <h2>Preguntas frecuentes</h2>
              <p>Resolvemos las dudas más comunes antes de tu viaje.</p>
            </div>
            <div className="faq-grid">
              {[
                {
                  question: '¿Qué necesito para alquilar un coche?',
                  answer:
                    'Necesitas un carnet de conducir válido, una tarjeta de crédito y un documento de identidad.',
                },
                {
                  question: '¿A qué edad puedo alquilar un coche?',
                  answer:
                    'Depende del país y la empresa, pero normalmente desde los 21 años.',
                },
                {
                  question: '¿Es posible alquilar sin tarjeta de crédito?',
                  answer:
                    'Algunas compañías permiten débito, pero debes verificarlo antes de reservar.',
                },
                {
                  question: '¿Qué debo considerar al elegir una compañía?',
                  answer:
                    'Compara las valoraciones, políticas de combustible y condiciones del seguro.',
                },
              ].map((item) => (
                <article className="faq-card" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

export default Home;
