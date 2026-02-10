import { useMemo } from 'react';
import Card from '../../../components/common/layout/Card';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import useEmployeeVehiclePage from '../../../hooks/pages/employee/useEmployeeVehiclePage';
import { MESSAGES } from '../../../constants';
import { buildVehicleFilterFields } from '../../../config/vehicleFilterFields';
import { getHeadquartersOptionLabel } from '../../../config/headquartersLabels';
import VehicleListContent from './vehicle-list/VehicleListContent';
import VehicleListHeader from './vehicle-list/VehicleListHeader';
import VehicleListModals from './vehicle-list/VehicleListModals';

// Página del empleado para gestionar el inventario de vehículos. Encapsula la entrada al módulo de flota.
function VehicleList() {
  const { state, ui, actions, meta } = useEmployeeVehiclePage();

  const headquartersOptions = useMemo(() => (
    state.headquarters.map((hq) => ({
      value: hq.headquartersId ?? hq.id,
      label: getHeadquartersOptionLabel(hq)
    }))
  ), [state.headquarters]);

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
        <VehicleListHeader
          onOpenInbox={actions.handleOpenInbox}
          onCreateVehicle={actions.handleOpenCreate}
        />

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

            <VehicleListContent
              vehicles={state.vehicles}
              loading={ui.isLoading}
              error={ui.error}
              pagination={meta.pagination}
              pageAlert={ui.pageAlert}
              statuses={state.statuses}
              onDismissAlert={() => actions.setPageAlert(null)}
              onViewDetails={actions.setSelectedVehicleId}
              onEditVehicle={actions.handleEditVehicle}
              onDeleteVehicle={actions.handleDeleteVehicle}
              onPageChange={actions.handlePageChange}
            />
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
