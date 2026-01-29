import { MESSAGES } from '../../constants/messages';

function HomeReviewsSection() {
  const reviews = [
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
  ];

  return (
    <section className="home-reviews">
      <div className="home-section">
        <div className="home-section-header">
          <h2>{MESSAGES.HOME_REVIEWS_TITLE}</h2>
          <p>{MESSAGES.HOME_REVIEWS_SUBTITLE}</p>
        </div>
        <div className="review-grid">
          {reviews.map((review, index) => (
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
  );
}

export default HomeReviewsSection;
