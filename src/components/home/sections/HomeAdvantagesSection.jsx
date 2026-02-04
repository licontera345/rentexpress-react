import { MESSAGES } from '../../../constants';

// Componente HomeAdvantagesSection que define la interfaz y organiza la lógica de esta vista.

function HomeAdvantagesSection() {
  return (
    <section className="home-advantages">
      <div className="home-section">
        <div className="home-section-header">
          <h2>{MESSAGES.HOME_ADVANTAGES_TITLE}</h2>
          <p>{MESSAGES.HOME_ADVANTAGES_SUBTITLE}</p>
        </div>
        <div className="advantage-grid">
          <article className="advantage-card">
            <h3>{MESSAGES.HOME_ADVANTAGE_FIND_TITLE}</h3>
            <p>{MESSAGES.HOME_ADVANTAGE_FIND_TEXT}</p>
          </article>
          <article className="advantage-card advantage-highlight">
            <h3>{MESSAGES.HOME_ADVANTAGE_WHY_TITLE}</h3>
            <ul>
              <li>{MESSAGES.HOME_ADVANTAGE_WHY_ITEM_1}</li>
              <li>{MESSAGES.HOME_ADVANTAGE_WHY_ITEM_2}</li>
              <li>{MESSAGES.HOME_ADVANTAGE_WHY_ITEM_3}</li>
              <li>{MESSAGES.HOME_ADVANTAGE_WHY_ITEM_4}</li>
            </ul>
          </article>
          <article className="advantage-card advantage-callout">
            <h3>{MESSAGES.HOME_ADVANTAGE_LOW_TITLE}</h3>
            <p>{MESSAGES.HOME_ADVANTAGE_LOW_TEXT}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HomeAdvantagesSection;
