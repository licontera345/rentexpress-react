import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import ClientRentalCard from '../../../components/rentals/list/ClientRentalCard';
import { useClientMyRentalsPage } from '../../../hooks/client/useClientPages';
import { MESSAGES, ROUTES } from '../../../constants';

const FILTER_ALL = 'all';
const FILTER_COMPLETED = 'completed';
const FILTER_CANCELLED = 'cancelled';
const FILTER_ACTIVE = 'active';
const SORT_RECENT = 'recent';
const SORT_OLDEST = 'oldest';
const SORT_AMOUNT_HIGH = 'amountHigh';
const SORT_AMOUNT_LOW = 'amountLow';

const getRentalStatusLabel = (rental, statusById) => {
  const status = statusById?.get?.(Number(rental?.rentalStatusId));
  return status?.statusName || rental?.rentalStatus?.statusName || '';
};

const isCompleted = (rental, statusById) => {
  const label = getRentalStatusLabel(rental, statusById);
  const lower = (label || '').trim().toLowerCase();
  return lower.includes('complet') || lower.includes('finish') || lower.includes('termin');
};

const isCancelled = (rental, statusById) => {
  const label = getRentalStatusLabel(rental, statusById);
  const lower = (label || '').trim().toLowerCase();
  return lower.includes('cancel') || lower.includes('annul');
};

const isActive = (rental, statusById) => {
  const label = getRentalStatusLabel(rental, statusById);
  const lower = (label || '').trim().toLowerCase();
  return lower.includes('progress') || lower.includes('curso') || lower.includes('en cours') || lower.includes('activo') || lower.includes('active');
};

function MyRentals() {
  const { state, ui, options } = useClientMyRentalsPage();
  const [filterTab, setFilterTab] = useState(FILTER_ALL);
  const [sortOrder, setSortOrder] = useState(SORT_RECENT);

  const { filteredRentals, counts } = useMemo(() => {
    const list = state.rentals || [];
    let filtered = list;
    if (filterTab === FILTER_COMPLETED) filtered = list.filter((r) => isCompleted(r, state.statusById));
    else if (filterTab === FILTER_CANCELLED) filtered = list.filter((r) => isCancelled(r, state.statusById));
    else if (filterTab === FILTER_ACTIVE) filtered = list.filter((r) => isActive(r, state.statusById));

    filtered = [...filtered].sort((a, b) => {
      if (sortOrder === SORT_RECENT || sortOrder === SORT_OLDEST) {
        const dateA = (a?.startDateEffective || a?.startDate) ? new Date(a.startDateEffective || a.startDate).getTime() : 0;
        const dateB = (b?.startDateEffective || b?.startDate) ? new Date(b.startDateEffective || b.startDate).getTime() : 0;
        return sortOrder === SORT_RECENT ? dateB - dateA : dateA - dateB;
      }
      const amountA = a?.totalCost != null ? Number(a.totalCost) : 0;
      const amountB = b?.totalCost != null ? Number(b.totalCost) : 0;
      return sortOrder === SORT_AMOUNT_HIGH ? amountB - amountA : amountA - amountB;
    });

    const all = state.rentals || [];
    return {
      filteredRentals: filtered,
      counts: {
        all: all.length,
        completed: all.filter((r) => isCompleted(r, state.statusById)).length,
        cancelled: all.filter((r) => isCancelled(r, state.statusById)).length,
        active: all.filter((r) => isActive(r, state.statusById)).length,
      },
    };
  }, [state.rentals, state.statusById, filterTab, sortOrder]);

  return (
    <PrivateLayout>
      <section className="personal-space my-rentals-page">
        <header className="page-header">
          <h1>{MESSAGES.MY_RENTALS_TITLE}</h1>
          <p>{MESSAGES.MY_RENTALS_SUBTITLE}</p>
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
          <div className="my-rentals-empty">
            <FiPackage aria-hidden />
            <h3>{MESSAGES.MY_RENTALS_TITLE}</h3>
            <p>{state.emptyMessage}</p>
            <Link className="btn btn-primary btn-small" to={options.catalogRoute}>
              {MESSAGES.NAV_CATALOG}
            </Link>
          </div>
        )}

        {!ui.isLoading && !ui.error && options.hasRentals && (
          <>
            <div className="my-rentals-filters">
              <div className="my-rentals-filter-tabs">
                <button
                  type="button"
                  className={`my-rentals-filter-tab ${filterTab === FILTER_ALL ? 'active' : ''}`}
                  onClick={() => setFilterTab(FILTER_ALL)}
                >
                  {MESSAGES.MY_RENTALS_FILTER_ALL} ({counts.all})
                </button>
                <button
                  type="button"
                  className={`my-rentals-filter-tab ${filterTab === FILTER_COMPLETED ? 'active' : ''}`}
                  onClick={() => setFilterTab(FILTER_COMPLETED)}
                >
                  {MESSAGES.MY_RENTALS_FILTER_COMPLETED} ({counts.completed})
                </button>
                <button
                  type="button"
                  className={`my-rentals-filter-tab ${filterTab === FILTER_CANCELLED ? 'active' : ''}`}
                  onClick={() => setFilterTab(FILTER_CANCELLED)}
                >
                  {MESSAGES.MY_RENTALS_FILTER_CANCELLED} ({counts.cancelled})
                </button>
                {counts.active > 0 && (
                  <button
                    type="button"
                    className={`my-rentals-filter-tab ${filterTab === FILTER_ACTIVE ? 'active' : ''}`}
                    onClick={() => setFilterTab(FILTER_ACTIVE)}
                  >
                    {MESSAGES.MY_RENTALS_FILTER_ACTIVE} ({counts.active})
                  </button>
                )}
              </div>
              <select
                className="my-rentals-sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label={MESSAGES.MY_RENTALS_SORT_RECENT}
              >
                <option value={SORT_RECENT}>{MESSAGES.MY_RENTALS_SORT_RECENT}</option>
                <option value={SORT_OLDEST}>{MESSAGES.MY_RENTALS_SORT_OLDEST}</option>
                <option value={SORT_AMOUNT_HIGH}>{MESSAGES.MY_RENTALS_SORT_AMOUNT_HIGH}</option>
                <option value={SORT_AMOUNT_LOW}>{MESSAGES.MY_RENTALS_SORT_AMOUNT_LOW}</option>
              </select>
            </div>

            <div className="my-rentals-list">
              {filteredRentals.length === 0 ? (
                <div className="my-rentals-empty">
                  <FiPackage aria-hidden />
                  <h3>{MESSAGES.MY_RENTALS_TITLE}</h3>
                  <p>{state.emptyMessage}</p>
                  <Link className="btn btn-primary btn-small" to={options.catalogRoute}>
                    {MESSAGES.NAV_CATALOG}
                  </Link>
                </div>
              ) : (
                filteredRentals.map((rental, index) => (
                  <ClientRentalCard
                    key={rental?.rentalId ?? rental?.id ?? `rental-${index}`}
                    rental={rental}
                    headquartersById={state.headquartersById}
                    statusById={state.statusById}
                  />
                ))
              )}
            </div>
          </>
        )}
      </section>
    </PrivateLayout>
  );
}

export default MyRentals;
