import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import ClientReservationCard from '../../../components/reservations/list/ClientReservationCard';
import ReservationFormModal from '../../../components/reservations/form/ReservationFormModal';
import { useClientMyReservationsPage } from '../../../hooks/client/useClientPages';
import { MESSAGES, ROUTES } from '../../../constants';
import { getReservationStatusCanonical } from '../../../utils/reservation/reservationUtils';

const FILTER_ALL = 'all';
const FILTER_UPCOMING = 'upcoming';
const FILTER_PAST = 'past';
const SORT_RECENT = 'recent';
const SORT_OLDEST = 'oldest';

function MyReservations() {
  const { state, ui, actions, options } = useClientMyReservationsPage();
  const [filterTab, setFilterTab] = useState(FILTER_ALL);
  const [sortOrder, setSortOrder] = useState(SORT_RECENT);

  const headquartersById = useMemo(
    () => new Map((state.headquarters || []).map((hq) => [Number(hq.id), hq])),
    [state.headquarters]
  );
  const statusById = useMemo(
    () => new Map((state.statuses || []).map((s) => [Number(s.reservationStatusId), s])),
    [state.statuses]
  );

  const { filteredReservations, counts } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isUpcoming = (r) => {
      const end = r?.endDate ? new Date(r.endDate) : null;
      if (!end || Number.isNaN(end.getTime())) return false;
      const canonical = getReservationStatusCanonical(
        statusById.get(Number(r?.reservationStatusId))?.statusName || ''
      );
      if (canonical === 'canceled') return false;
      end.setHours(0, 0, 0, 0);
      return end >= today;
    };

    const isPast = (r) => {
      const end = r?.endDate ? new Date(r.endDate) : null;
      const canonical = getReservationStatusCanonical(
        statusById.get(Number(r?.reservationStatusId))?.statusName || ''
      );
      if (canonical === 'canceled') return true;
      if (!end || Number.isNaN(end.getTime())) return false;
      end.setHours(0, 0, 0, 0);
      return end < today;
    };

    let list = state.reservations || [];
    if (filterTab === FILTER_UPCOMING) list = list.filter(isUpcoming);
    else if (filterTab === FILTER_PAST) list = list.filter(isPast);

    list = [...list].sort((a, b) => {
      const dateA = a?.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b?.startDate ? new Date(b.startDate).getTime() : 0;
      return sortOrder === SORT_RECENT ? dateB - dateA : dateA - dateB;
    });

    const all = state.reservations || [];
    const upcomingCount = all.filter(isUpcoming).length;
    const pastCount = all.filter(isPast).length;

    return {
      filteredReservations: list,
      counts: { all: all.length, upcoming: upcomingCount, past: pastCount },
    };
  }, [state.reservations, filterTab, sortOrder, statusById]);

  return (
    <PrivateLayout>
      <section className="personal-space my-reservations-page">
        <header className="page-header">
          <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
          <p>{MESSAGES.MY_RESERVATIONS_SUBTITLE}</p>
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

        {ui.pageAlert && (
          <Card className="personal-space-card">
            <div className={`alert alert-${ui.pageAlert.type === 'success' ? 'success' : 'error'}`}>
              <span>{ui.pageAlert.message}</span>
              <button type="button" className="alert-close" onClick={() => actions.setPageAlert(null)} aria-label={MESSAGES.CLOSE}>
                ×
              </button>
            </div>
          </Card>
        )}

        {!ui.isLoading && !ui.error && !options.hasReservations && (
          <div className="my-reservations-empty">
            <FiPackage aria-hidden />
            <h3>{MESSAGES.MY_RESERVATIONS_TITLE}</h3>
            <p>{MESSAGES.MY_RESERVATIONS_EMPTY}</p>
            <Link className="btn btn-primary btn-small" to={ROUTES.CATALOG}>
              {MESSAGES.NAV_CATALOG}
            </Link>
          </div>
        )}

        {!ui.isLoading && !ui.error && options.hasReservations && (
          <>
            <div className="my-reservations-filters">
              <div className="my-reservations-filter-tabs">
                <button
                  type="button"
                  className={`my-reservations-filter-tab ${filterTab === FILTER_ALL ? 'active' : ''}`}
                  onClick={() => setFilterTab(FILTER_ALL)}
                >
                  {MESSAGES.MY_RESERVATIONS_FILTER_ALL} ({counts.all})
                </button>
                <button
                  type="button"
                  className={`my-reservations-filter-tab ${filterTab === FILTER_UPCOMING ? 'active' : ''}`}
                  onClick={() => setFilterTab(FILTER_UPCOMING)}
                >
                  {MESSAGES.MY_RESERVATIONS_FILTER_UPCOMING} ({counts.upcoming})
                </button>
                <button
                  type="button"
                  className={`my-reservations-filter-tab ${filterTab === FILTER_PAST ? 'active' : ''}`}
                  onClick={() => setFilterTab(FILTER_PAST)}
                >
                  {MESSAGES.MY_RESERVATIONS_FILTER_PAST} ({counts.past})
                </button>
              </div>
              <select
                className="my-reservations-sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label={MESSAGES.MY_RESERVATIONS_SORT_RECENT}
              >
                <option value={SORT_RECENT}>{MESSAGES.MY_RESERVATIONS_SORT_RECENT}</option>
                <option value={SORT_OLDEST}>{MESSAGES.MY_RESERVATIONS_SORT_OLDEST}</option>
              </select>
            </div>

            <div className="my-reservations-list">
              {filteredReservations.length === 0 ? (
                <div className="my-reservations-empty">
                  <FiPackage aria-hidden />
                  <h3>{MESSAGES.MY_RESERVATIONS_TITLE}</h3>
                  <p>{MESSAGES.MY_RESERVATIONS_EMPTY}</p>
                  <Link className="btn btn-primary btn-small" to={ROUTES.CATALOG}>
                    {MESSAGES.NAV_CATALOG}
                  </Link>
                </div>
              ) : (
                filteredReservations.map((reservation, index) => (
                  <ClientReservationCard
                    key={reservation?.reservationId || reservation?.id || `reservation-${index}`}
                    reservation={reservation}
                    headquartersById={headquartersById}
                    statusById={statusById}
                    onEdit={options.isPendingReservation(reservation) ? actions.handleEditReservation : undefined}
                    onDelete={options.isPendingReservation(reservation) ? actions.handleDeleteReservation : undefined}
                    showPickupCode
                  />
                ))
              )}
            </div>
          </>
        )}

        <ReservationFormModal
          isOpen={ui.isEditOpen}
          title={MESSAGES.RESERVATION_EDIT_TITLE}
          description={MESSAGES.RESERVATION_EDIT_DESCRIPTION}
          titleId="reservation-client-edit-title"
          formData={state.editForm}
          fieldErrors={state.editErrors}
          onChange={actions.handleEditChange}
          onSubmit={actions.handleUpdateReservation}
          onClose={actions.closeEditModal}
          vehicles={state.vehicles}
          statuses={state.statuses}
          headquarters={state.headquarters}
          headquartersError={ui.headquartersError}
          headquartersLoading={ui.headquartersLoading}
          alert={state.editFormAlert ? {
            type: state.editFormAlert.type,
            message: state.editFormAlert.message,
            onClose: actions.clearEditFormAlert
          } : undefined}
          isSubmitting={ui.isSubmitting}
          isLoading={ui.isEditLoading}
          submitLabel={MESSAGES.UPDATE_RESERVATION}
          clientEditMode
        />
      </section>
    </PrivateLayout>
  );
}

export default MyReservations;
