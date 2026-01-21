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
              <h1 className="sr-only">{MESSAGES.HOME_TITLE}</h1>
              <p className="sr-only">{MESSAGES.HOME_HERO_IMAGE_ALT}</p>
              <div className="hero-search">
                <SearchPanel onSearch={handleSearch} variant="hero" />
              </div>
            </div>
          </div>
        </section>
        <section className="home-reviews">
          <div className="home-section">
            <div className="home-section-header">
              <h2>{MESSAGES.HOME_REVIEWS_TITLE}</h2>
              <p>{MESSAGES.HOME_REVIEWS_SUBTITLE}</p>
            </div>
            <div className="review-grid">
              {[
                {
                  title: MESSAGES.HOME_REVIEW_1_TITLE,
                  text: MESSAGES.HOME_REVIEW_1_TEXT,
                  author: MESSAGES.HOME_REVIEW_1_AUTHOR,
                  date: MESSAGES.HOME_REVIEW_1_DATE,
                },
                {
                  title: MESSAGES.HOME_REVIEW_2_TITLE,
                  text: MESSAGES.HOME_REVIEW_2_TEXT,
                  author: MESSAGES.HOME_REVIEW_2_AUTHOR,
                  date: MESSAGES.HOME_REVIEW_2_DATE,
                },
                {
                  title: MESSAGES.HOME_REVIEW_3_TITLE,
                  text: MESSAGES.HOME_REVIEW_3_TEXT,
                  author: MESSAGES.HOME_REVIEW_3_AUTHOR,
                  date: MESSAGES.HOME_REVIEW_3_DATE,
                },
                {
                  title: MESSAGES.HOME_REVIEW_4_TITLE,
                  text: MESSAGES.HOME_REVIEW_4_TEXT,
                  author: MESSAGES.HOME_REVIEW_4_AUTHOR,
                  date: MESSAGES.HOME_REVIEW_4_DATE,
                },
              ].map((review, index) => (
                <article className="review-card" key={index}>
                  <div className="review-stars" aria-label={MESSAGES.HOME_REVIEW_STARS_LABEL}>
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
              <span>{MESSAGES.HOME_REVIEW_FOOTER_RATING}</span>
              <strong>{MESSAGES.HOME_REVIEW_FOOTER_FAVORITES}</strong>
            </div>
          </div>
        </section>

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

        <section className="home-trust">
          <div className="home-section trust-grid">
            <div className="trust-intro">
              <h2>{MESSAGES.HOME_TRUST_TITLE}</h2>
              <p>{MESSAGES.HOME_TRUST_TEXT}</p>
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
              { value: '164', label: MESSAGES.HOME_STAT_COUNTRIES },
              { value: '50 000+', label: MESSAGES.HOME_STAT_LOCATIONS },
              { value: '1000+', label: MESSAGES.HOME_STAT_PARTNERS },
              { value: '33', label: MESSAGES.HOME_STAT_LANGUAGES },
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
              <h2>{MESSAGES.HOME_TIPS_TITLE}</h2>
              <p>{MESSAGES.HOME_TIPS_SUBTITLE}</p>
            </div>
            <div className="tips-grid">
              {[
                {
                  title: MESSAGES.HOME_TIP_1_TITLE,
                  text: MESSAGES.HOME_TIP_1_TEXT,
                },
                {
                  title: MESSAGES.HOME_TIP_2_TITLE,
                  text: MESSAGES.HOME_TIP_2_TEXT,
                },
                {
                  title: MESSAGES.HOME_TIP_3_TITLE,
                  text: MESSAGES.HOME_TIP_3_TEXT,
                },
                {
                  title: MESSAGES.HOME_TIP_4_TITLE,
                  text: MESSAGES.HOME_TIP_4_TEXT,
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
              <h2>{MESSAGES.HOME_REQUIREMENTS_TITLE}</h2>
              <p>{MESSAGES.HOME_REQUIREMENTS_SUBTITLE}</p>
            </div>
            <div className="requirements-grid">
              {[
                {
                  title: MESSAGES.HOME_REQUIREMENT_1_TITLE,
                  text: MESSAGES.HOME_REQUIREMENT_1_TEXT,
                },
                {
                  title: MESSAGES.HOME_REQUIREMENT_2_TITLE,
                  text: MESSAGES.HOME_REQUIREMENT_2_TEXT,
                },
                {
                  title: MESSAGES.HOME_REQUIREMENT_3_TITLE,
                  text: MESSAGES.HOME_REQUIREMENT_3_TEXT,
                },
                {
                  title: MESSAGES.HOME_REQUIREMENT_4_TITLE,
                  text: MESSAGES.HOME_REQUIREMENT_4_TEXT,
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
              <h2>{MESSAGES.HOME_FAQ_TITLE}</h2>
              <p>{MESSAGES.HOME_FAQ_SUBTITLE}</p>
            </div>
            <div className="faq-grid">
              {[
                {
                  question: MESSAGES.HOME_FAQ_1_QUESTION,
                  answer: MESSAGES.HOME_FAQ_1_ANSWER,
                },
                {
                  question: MESSAGES.HOME_FAQ_2_QUESTION,
                  answer: MESSAGES.HOME_FAQ_2_ANSWER,
                },
                {
                  question: MESSAGES.HOME_FAQ_3_QUESTION,
                  answer: MESSAGES.HOME_FAQ_3_ANSWER,
                },
                {
                  question: MESSAGES.HOME_FAQ_4_QUESTION,
                  answer: MESSAGES.HOME_FAQ_4_ANSWER,
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
