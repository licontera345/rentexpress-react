import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import ListResultsPanel from '../../../components/common/layout/ListResultsPanel';
import SectionHeader from '../../../components/common/layout/SectionHeader';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import RentalListItem from '../../../components/rentals/list/RentalListItem';
import RentalFormModal from '../../../components/rentals/form/RentalFormModal';
import RentalReturnModal from '../../../components/rentals/form/RentalReturnModal';
import { MESSAGES } from '../../../constants';
import useEmployeeRentalsPage from '../../../hooks/employee/useEmployeeRentalsPage';

function RentalsList() {
  const { state, ui, actions, options } = useEmployeeRentalsPage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <SectionHeader
          title={MESSAGES.RENTALS_LIST_TITLE}
          subtitle={MESSAGES.RENTALS_LIST_SUBTITLE}
        />

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            <aside className="vehicle-filter-panel">
              <FilterPanel
                fields={options.filterFields}
                values={state.filters}
                onChange={actions.handleFilterChange}
                onApply={actions.applyFilters}
                onReset={actions.resetFilters}
                title={MESSAGES.FILTER_BY}
                isLoading={ui.isLoading}
                className="vehicle-filters-panel"
              />
            </aside>

            <ListResultsPanel
              pageAlert={ui.pageAlert}
              onCloseAlert={() => actions.setPageAlert(null)}
              loading={ui.isLoading}
              error={ui.error}
              emptyDescription={MESSAGES.NO_RENTALS_REGISTERED}
              hasItems={state.rentals.length > 0}
              pagination={options.pagination}
              onPageChange={actions.handlePageChange}
            >
              {state.rentals.map((rental) => (
                <RentalListItem
                  key={rental.rentalId}
                  rental={rental}
                  onEdit={actions.handleEditRental}
                  onDelete={actions.handleDeleteRental}
                  onCompleteReturn={actions.handleCompleteReturn}
                  headquartersById={options.headquartersById}
                  statusById={options.statusById}
                />
              ))}
            </ListResultsPanel>
          </div>
        </Card>
      </section>

      <RentalReturnModal
        isOpen={ui.isReturnOpen}
        rental={state.returnRental}
        onConfirm={actions.handleConfirmReturn}
        onClose={actions.closeReturnModal}
        alert={ui.returnAlert && { ...ui.returnAlert, onClose: () => actions.setReturnAlert(null) }}
        isSubmitting={ui.isReturning}
      />

      <RentalFormModal
        isOpen={ui.isEditOpen}
        title={ui.isViewMode ? MESSAGES.RENTAL_VIEW_TITLE : MESSAGES.RENTAL_EDIT_TITLE}
        description={ui.isViewMode ? '' : MESSAGES.RENTAL_EDIT_DESCRIPTION}
        titleId="rental-edit-title"
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={actions.handleEditChange}
        onSubmit={actions.handleUpdateRental}
        onClose={actions.closeEditModal}
        statuses={options.statuses || []}
        headquarters={options.headquarters || []}
        alert={state.editForm.formAlert && { ...state.editForm.formAlert, onClose: () => state.editForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE_RENTAL}
        readOnly={ui.isViewMode}
      />
    </PrivateLayout>
  );
}

export default RentalsList;
