import SearchPanel from '../common/search/SearchPanel';
import { MESSAGES } from '../../constants';

function HomeHeroSection({ backgroundImage, onSearch }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1 className="sr-only">{MESSAGES.HOME_TITLE}</h1>
          <p className="sr-only">{MESSAGES.HOME_HERO_IMAGE_ALT}</p>
          <div className="hero-search">
            <SearchPanel onSearch={onSearch} variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHeroSection;
