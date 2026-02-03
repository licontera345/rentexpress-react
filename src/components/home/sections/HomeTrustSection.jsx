import { MESSAGES } from '../../../constants';

function HomeTrustSection() {
  const trustItems = [
    { label: 'Trustpilot', rating: '4,6' },
    { label: 'Google', rating: '4,5' },
    { label: 'Review Centre', rating: '4,2' },
    { label: 'Reviews.io', rating: '4,4' },
  ];

  return (
    <section className="home-trust">
      <div className="home-section trust-grid">
        <div className="trust-intro">
          <h2>{MESSAGES.HOME_TRUST_TITLE}</h2>
          <p>{MESSAGES.HOME_TRUST_TEXT}</p>
        </div>
        <div className="trust-cards">
          {trustItems.map((item) => (
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
