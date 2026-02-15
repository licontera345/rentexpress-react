import { useMemo } from 'react';
import Card from '../../../components/common/layout/Card';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import ListResultsPanel from '../../../components/common/layout/ListResultsPanel';
import SectionHeader from '../../../components/common/layout/SectionHeader';
import VehicleListItem from '../../../components/vehicle/catalog/VehicleListItem';
import useEmployeeVehiclePage from '../../../hooks/employee/useEmployeeVehiclePage';
import { MESSAGES } from '../../../constants';
import { buildVehicleFilterFields } from '../../../constants/vehicleFilterFields';
import { buildHeadquartersOptions } from '../../../utils/headquartersUtils';
import { buildVehicleStatusMap } from '../../../utils/vehicleUtils';
import VehicleListModals from './vehicle-list/VehicleListModals';

// Página del empleado para gestionar el inventario de vehículos. Encapsula la entrada al módulo de flota.
function VehicleList() {
  const { state, ui, actions, meta } = useEmployeeVehiclePage();
  const statusMap = useMemo(() => buildVehicleStatusMap(state.statuses), [state.statuses]);
  const headquartersOptions = buildHeadquartersOptions(state.headquarters);

  const filterFields = buildVehicleFilterFields({
    categories: state.categories,
    statuses: state.statuses,
    headquarters: state.headquarters,
    includeIdentifiers: true,
    includeStatus: true,
    includeActiveStatus: true,
    includeHeadquarters: true
  });

  return (
    <PrivateLayout>
      <section className="personal-space">
        <SectionHeader
          title={MESSAGES.VEHICLE_LIST_TITLE}
          subtitle={MESSAGES.VEHICLE_LIST_SUBTITLE}
        >
          <button
            type="button"
            className="vehicle-inbox-trigger"
            onClick={actions.handleOpenInbox}
            aria-label={MESSAGES.MAINTENANCE_INBOX_OPEN}
          >
            <span>{MESSAGES.MAINTENANCE_INBOX_OPEN}</span>
          </button>
          <button
            type="button"
            className="vehicle-create-trigger"
            onClick={actions.handleOpenCreate}
            aria-label={MESSAGES.ADD_VEHICLE}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
            </svg>
          </button>
        </SectionHeader>

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            <aside className="vehicle-filter-panel">
              <FilterPanel
                fields={filterFields}
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
              emptyDescription={MESSAGES.NO_VEHICLES_REGISTERED}
              hasItems={state.vehicles.length > 0}
              pagination={meta.pagination}
              onPageChange={actions.handlePageChange}
            >
              {state.vehicles.map((vehicle) => (
                <VehicleListItem
                  key={vehicle.vehicleId}
                  vehicle={vehicle}
                  statusMap={statusMap}
                  onViewDetails={actions.setSelectedVehicleId}
                  onEdit={actions.handleEditVehicle}
                  onDelete={actions.handleDeleteVehicle}
                />
              ))}
            </ListResultsPanel>
          </div>
        </Card>
      </section>

      <VehicleListModals
        selectedVehicleId={state.selectedVehicleId}
        onCloseVehicleDetails={() => actions.setSelectedVehicleId(null)}
        onReserve={actions.handleReserve}
        inbox={{
          isOpen: ui.isInboxOpen,
          items: state.inboxItems,
          onClose: actions.handleCloseInbox,
          onApprove: actions.handleApproveMaintenance,
          onViewDetails: actions.handleInboxViewDetails,
          isLoading: ui.inboxLoading,
          error: ui.inboxError,
          approvingIds: ui.approvingItems,
          alert: ui.inboxAlert,
          onDismissAlert: () => actions.setInboxAlert(null)
        }}
        createForm={state.createForm}
        editForm={state.editForm}
        categories={state.categories}
        statuses={state.statuses}
        headquartersOptions={headquartersOptions}
        hqLoading={ui.hqLoading}
        isCreateOpen={ui.isCreateOpen}
        onCloseCreate={actions.handleCloseCreate}
        onSubmitCreate={actions.handleCreateVehicle}
        isEditOpen={ui.isEditOpen}
        onCloseEdit={actions.handleCloseEditModal}
        onSubmitEdit={actions.handleUpdateVehicle}
        isSubmitting={ui.isSubmitting}
        isEditLoading={ui.isEditLoading}
        createImageState={state.createImageState}
        editImageState={state.editImageState}
      />
    </PrivateLayout>
  );
}

export default VehicleList;
