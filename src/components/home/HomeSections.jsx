import { FiCalendar, FiCreditCard, FiMapPin, FiTruck } from 'react-icons/fi';
import SearchPanel from '../common/search/SearchPanel';
import { HomeSection, HomeSectionHeader } from './HomeSectionLayout';
import { HOME_STATS_VALUES, HOME_TRUST_ITEMS, MESSAGES } from '../../constants';

export function HomeHeroSection({ backgroundImage, searchPanelProps }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1 className="sr-only">{MESSAGES.HOME_TITLE}</h1>
          <p className="sr-only">{MESSAGES.HOME_HERO_IMAGE_ALT}</p>
          <div className="hero-search">
            <SearchPanel {...searchPanelProps} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeReviewsSection() {
  const reviews = [
    { title: MESSAGES.HOME_REVIEW_1_TITLE, text: MESSAGES.HOME_REVIEW_1_TEXT, author: MESSAGES.HOME_REVIEW_1_AUTHOR, date: MESSAGES.HOME_REVIEW_1_DATE },
    { title: MESSAGES.HOME_REVIEW_2_TITLE, text: MESSAGES.HOME_REVIEW_2_TEXT, author: MESSAGES.HOME_REVIEW_2_AUTHOR, date: MESSAGES.HOME_REVIEW_2_DATE },
    { title: MESSAGES.HOME_REVIEW_3_TITLE, text: MESSAGES.HOME_REVIEW_3_TEXT, author: MESSAGES.HOME_REVIEW_3_AUTHOR, date: MESSAGES.HOME_REVIEW_3_DATE },
    { title: MESSAGES.HOME_REVIEW_4_TITLE, text: MESSAGES.HOME_REVIEW_4_TEXT, author: MESSAGES.HOME_REVIEW_4_AUTHOR, date: MESSAGES.HOME_REVIEW_4_DATE },
  ];
  return (
    <section className="home-reviews">
      <HomeSection>
        <HomeSectionHeader title={MESSAGES.HOME_REVIEWS_TITLE} subtitle={MESSAGES.HOME_REVIEWS_SUBTITLE} />
        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.title}>
              <div className="review-stars" aria-label={MESSAGES.HOME_REVIEW_STARS_LABEL}>{'★★★★★'}</div>
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
      </HomeSection>
    </section>
  );
}

export function HomeAdvantagesSection() {
  return (
    <section className="home-advantages">
      <HomeSection>
        <HomeSectionHeader title={MESSAGES.HOME_ADVANTAGES_TITLE} subtitle={MESSAGES.HOME_ADVANTAGES_SUBTITLE} />
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
      </HomeSection>
    </section>
  );
}

export function HomeTrustSection() {
  return (
    <section className="home-trust">
      <HomeSection className="trust-grid">
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
      </HomeSection>
    </section>
  );
}

export function HomeStatsSection() {
  const stats = [
    { value: HOME_STATS_VALUES.COUNTRIES, label: MESSAGES.HOME_STAT_COUNTRIES },
    { value: HOME_STATS_VALUES.LOCATIONS, label: MESSAGES.HOME_STAT_LOCATIONS },
    { value: HOME_STATS_VALUES.PARTNERS, label: MESSAGES.HOME_STAT_PARTNERS },
    { value: HOME_STATS_VALUES.LANGUAGES, label: MESSAGES.HOME_STAT_LANGUAGES },
  ];
  return (
    <section className="home-stats">
      <HomeSection className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </HomeSection>
    </section>
  );
}

export function HomeTipsSection() {
  const tips = [
    { title: MESSAGES.HOME_TIP_1_TITLE, text: MESSAGES.HOME_TIP_1_TEXT, icon: FiCalendar },
    { title: MESSAGES.HOME_TIP_2_TITLE, text: MESSAGES.HOME_TIP_2_TEXT, icon: FiMapPin },
    { title: MESSAGES.HOME_TIP_3_TITLE, text: MESSAGES.HOME_TIP_3_TEXT, icon: FiCreditCard },
    { title: MESSAGES.HOME_TIP_4_TITLE, text: MESSAGES.HOME_TIP_4_TEXT, icon: FiTruck },
  ];
  return (
    <section className="home-tips">
      <HomeSection>
        <HomeSectionHeader title={MESSAGES.HOME_TIPS_TITLE} subtitle={MESSAGES.HOME_TIPS_SUBTITLE} />
        <div className="tips-grid">
          {tips.map((tip) => {
            const TipIcon = tip.icon;
            return (
              <article className="tip-card" key={tip.title}>
                <span className="tip-card-icon" aria-hidden="true"><TipIcon /></span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </article>
            );
          })}
        </div>
      </HomeSection>
    </section>
  );
}

export function HomeRequirementsSection() {
  const requirements = [
    { title: MESSAGES.HOME_REQUIREMENT_1_TITLE, text: MESSAGES.HOME_REQUIREMENT_1_TEXT },
    { title: MESSAGES.HOME_REQUIREMENT_2_TITLE, text: MESSAGES.HOME_REQUIREMENT_2_TEXT },
    { title: MESSAGES.HOME_REQUIREMENT_3_TITLE, text: MESSAGES.HOME_REQUIREMENT_3_TEXT },
    { title: MESSAGES.HOME_REQUIREMENT_4_TITLE, text: MESSAGES.HOME_REQUIREMENT_4_TEXT },
  ];
  return (
    <section className="home-requirements">
      <HomeSection>
        <HomeSectionHeader title={MESSAGES.HOME_REQUIREMENTS_TITLE} subtitle={MESSAGES.HOME_REQUIREMENTS_SUBTITLE} />
        <div className="requirements-grid">
          {requirements.map((item) => (
            <article className="requirement-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </HomeSection>
    </section>
  );
}

export function HomeFaqSection() {
  const faqs = [
    { question: MESSAGES.HOME_FAQ_1_QUESTION, answer: MESSAGES.HOME_FAQ_1_ANSWER },
    { question: MESSAGES.HOME_FAQ_2_QUESTION, answer: MESSAGES.HOME_FAQ_2_ANSWER },
    { question: MESSAGES.HOME_FAQ_3_QUESTION, answer: MESSAGES.HOME_FAQ_3_ANSWER },
    { question: MESSAGES.HOME_FAQ_4_QUESTION, answer: MESSAGES.HOME_FAQ_4_ANSWER },
  ];
  return (
    <section className="home-faq">
      <HomeSection>
        <HomeSectionHeader title={MESSAGES.HOME_FAQ_TITLE} subtitle={MESSAGES.HOME_FAQ_SUBTITLE} />
        <div className="faq-grid">
          {faqs.map((item) => (
            <article className="faq-card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </HomeSection>
    </section>
  );
}
