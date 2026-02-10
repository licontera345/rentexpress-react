import { useMemo } from 'react';
import Card from '../../../components/common/layout/Card';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import useEmployeeVehiclePage from '../../../hooks/useEmployeeVehiclePage';
import { MESSAGES } from '../../../constants';
import { buildVehicleFilterFields } from '../../../config/vehicleFilterFields';
import { getHeadquartersOptionLabel } from '../../../config/headquartersLabels';
import VehicleListContent from './vehicle-list/VehicleListContent';
import VehicleListHeader from './vehicle-list/VehicleListHeader';
import VehicleListModals from './vehicle-list/VehicleListModals';

// Página del empleado para gestionar el inventario de vehículos. Encapsula la entrada al módulo de flota.
function VehicleList() {
  const {
    headquarters,
    hqLoading,
    vehicles,
    loading,
    error,
    filters,
    categories,
    statuses,
    pagination,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
    createForm,
    editForm,
    pageAlert,
    setPageAlert,
    selectedVehicleId,
    setSelectedVehicleId,
    isSubmitting,
    isCreateOpen,
    isEditOpen,
    isEditLoading,
    handleOpenInbox,
    handleCloseInbox,
    handleApproveMaintenance,
    handleInboxViewDetails,
    inboxItems,
    inboxLoading,
    inboxError,
    inboxAlert,
    approvingItems,
    isInboxOpen,
    setInboxAlert,
    handleCreateVehicle,
    handleEditVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
    handleReserve,
    handleCloseEditModal,
    handleOpenCreate,
    handleCloseCreate,
    createImageState,
    editImageState
  } = useEmployeeVehiclePage();

  const headquartersOptions = useMemo(() => (
    headquarters.map((hq) => ({
      value: hq.headquartersId ?? hq.id,
      label: getHeadquartersOptionLabel(hq)
    }))
  ), [headquarters]);

  const filterFields = buildVehicleFilterFields({
    categories,
    statuses,
    headquarters,
    includeIdentifiers: true,
    includeStatus: true,
    includeActiveStatus: true,
    includeHeadquarters: true
  });

  return (
    <PrivateLayout>
      <section className="personal-space">
        <VehicleListHeader
          onOpenInbox={handleOpenInbox}
          onCreateVehicle={handleOpenCreate}
        />

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            <aside className="vehicle-filter-panel">
              <FilterPanel
                fields={filterFields}
                values={filters}
                onChange={handleFilterChange}
                onApply={applyFilters}
                onReset={resetFilters}
                title={MESSAGES.FILTER_BY}
                isLoading={loading}
                className="vehicle-filters-panel"
              />
            </aside>

            <VehicleListContent
              vehicles={vehicles}
              loading={loading}
              error={error}
              pagination={pagination}
              pageAlert={pageAlert}
              statuses={statuses}
              onDismissAlert={() => setPageAlert(null)}
              onViewDetails={setSelectedVehicleId}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onPageChange={handlePageChange}
            />
          </div>
        </Card>
      </section>

      <VehicleListModals
        selectedVehicleId={selectedVehicleId}
        onCloseVehicleDetails={() => setSelectedVehicleId(null)}
        onReserve={handleReserve}
        inbox={{
          isOpen: isInboxOpen,
          items: inboxItems,
          onClose: handleCloseInbox,
          onApprove: handleApproveMaintenance,
          onViewDetails: handleInboxViewDetails,
          isLoading: inboxLoading,
          error: inboxError,
          approvingIds: approvingItems,
          alert: inboxAlert,
          onDismissAlert: () => setInboxAlert(null)
        }}
        createForm={createForm}
        editForm={editForm}
        categories={categories}
        statuses={statuses}
        headquartersOptions={headquartersOptions}
        hqLoading={hqLoading}
        isCreateOpen={isCreateOpen}
        onCloseCreate={handleCloseCreate}
        onSubmitCreate={handleCreateVehicle}
        isEditOpen={isEditOpen}
        onCloseEdit={handleCloseEditModal}
        onSubmitEdit={handleUpdateVehicle}
        isSubmitting={isSubmitting}
        isEditLoading={isEditLoading}
        createImageState={createImageState}
        editImageState={editImageState}
      />
    </PrivateLayout>
  );
}

export default VehicleList;
