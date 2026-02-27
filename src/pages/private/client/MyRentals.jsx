import { Link } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import RentalListItem from '../../../components/rentals/list/RentalListItem';
import { useClientMyRentalsPage } from '../../../hooks/client/useClientPages';
import { MESSAGES } from '../../../constants';

function MyRentals() {
  const { state, ui, options } = useClientMyRentalsPage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.MY_RENTALS_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.MY_RENTALS_SUBTITLE}</p>
          </div>
          {options.hasRentals && (
            <div className="personal-space-meta">
              <span className="personal-space-meta-label">{MESSAGES.RENTALS_COUNT}</span>
              <span className="personal-space-meta-value">{state.rentals.length}</span>
            </div>
          )}
        </header>

        {ui.isLoading && (
          <Card className="personal-space-card">
            <p>{MESSAGES.LOADING}</p>
          </Card>
        )}

        {!ui.isLoading && ui.error && (
          <Card className="personal-space-card">
            <div className="alert alert-error">
              <span>{ui.error}</span>
            </div>
          </Card>
        )}

        {!ui.isLoading && !ui.error && !options.hasRentals && (
          <Card className="personal-space-card">
            <p>{state.emptyMessage}</p>
            <Link className="btn btn-primary btn-small personal-space-card-link" to={options.catalogRoute}>
              {MESSAGES.NAV_CATALOG}
            </Link>
          </Card>
        )}

        {!ui.isLoading && !ui.error && options.hasRentals && (
          <div className="reservations-list">
            {state.rentals.map((rental, index) => (
              <RentalListItem
                key={rental?.rentalId ?? `rental-${index}`}
                rental={rental}
                headquartersById={state.headquartersById}
                statusById={state.statusById}
              />
            ))}
          </div>
        )}
      </section>
    </PrivateLayout>
  );
}

export default MyRentals;
