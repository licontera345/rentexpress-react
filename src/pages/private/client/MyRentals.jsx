import { Link } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import useClientMyRentalsPage from '../../../hooks/useClientMyRentalsPage';
import { MESSAGES } from '../../../constants';

function MyRentals() {
  const { emptyMessage, catalogRoute } = useClientMyRentalsPage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.MY_RENTALS_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.MY_RENTALS_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card">
          <p>{emptyMessage}</p>
          <Link className="btn btn-primary btn-small personal-space-card-link" to={catalogRoute}>
            {MESSAGES.NAV_CATALOG}
          </Link>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default MyRentals;
