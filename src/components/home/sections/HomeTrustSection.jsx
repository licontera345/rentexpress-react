import { HOME_TRUST_ITEMS, MESSAGES } from '../../../constants';

// Componente HomeTrustSection que define la interfaz y organiza la lógica de esta vista.

function HomeTrustSection() {
  return (
    <section className="home-trust">
      <div className="home-section trust-grid">
        <div className="trust-intro">
          <h2>{MESSAGES.HOME_TRUST_TITLE}</h2>
          <p>{MESSAGES.HOME_TRUST_TEXT}</p>
        </div>
        <div className="trust-cards">
          {HOME_TRUST_ITEMS.map((item) => (
            <div className="trust-card" key={item.label}>
              <strong>{item.rating}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeTrustSection;
