import MaintenanceInboxModal from '../../../../components/vehicle/modals/MaintenanceInboxModal';
import VehicleDetailModal from '../../../../components/vehicle/modals/VehicleDetailModal';
import VehicleFormModal from '../../../../components/vehicle/forms/VehicleFormModal';
import { MESSAGES } from '../../../../constants';

function VehicleListModals({
  selectedVehicleId,
  vehicleDetailData,
  vehicleDetailDialogRef,
  onCloseVehicleDetails,
  onReserve,
  inbox,
  createForm,
  editForm,
  categories,
  statuses,
  headquartersOptions,
  hqLoading,
  isCreateOpen,
  onCloseCreate,
  onSubmitCreate,
  isEditOpen,
  onCloseEdit,
  onSubmitEdit,
  isSubmitting,
  isEditLoading,
  createImageState,
  editImageState
}) {
  return (
    <>
      <VehicleDetailModal
        vehicleId={selectedVehicleId}
        formattedVehicle={vehicleDetailData?.formattedVehicle}
        loading={vehicleDetailData?.loading}
        error={vehicleDetailData?.error}
        imageSrc={vehicleDetailData?.imageSrc}
        hasImage={vehicleDetailData?.hasImage}
        vehicle={vehicleDetailData?.vehicle}
        dialogRef={vehicleDetailDialogRef}
        onClose={onCloseVehicleDetails}
        onReserve={onReserve}
        showReserveButton={false}
      />

      <MaintenanceInboxModal
        isOpen={inbox.isOpen}
        items={inbox.items}
        onClose={inbox.onClose}
        onApprove={inbox.onApprove}
        onViewDetails={inbox.onViewDetails}
        isLoading={inbox.isLoading}
        error={inbox.error}
        approvingIds={inbox.approvingIds}
        alert={inbox.alert && {
          ...inbox.alert,
          onClose: inbox.onDismissAlert
        }}
      />

      <VehicleFormModal
        isOpen={isCreateOpen}
        title={MESSAGES.VEHICLE_CREATE_TITLE}
        description={MESSAGES.VEHICLE_CREATE_DESCRIPTION}
        titleId="vehicle-create-title"
        formData={createForm.formData}
        onChange={createForm.handleFormChange}
        onSubmit={onSubmitCreate}
        onClose={onCloseCreate}
        categories={categories}
        statuses={statuses}
        headquartersOptions={headquartersOptions}
        hqLoading={hqLoading}
        alert={createForm.formAlert && {
          ...createForm.formAlert,
          onClose: () => createForm.setFormAlert(null)
        }}
        isSubmitting={isSubmitting}
        submitLabel={MESSAGES.ADD_VEHICLE}
        {...createImageState}
      />

      <VehicleFormModal
        isOpen={isEditOpen}
        title={MESSAGES.VEHICLE_EDIT_TITLE}
        description={MESSAGES.VEHICLE_EDIT_DESCRIPTION}
        titleId="vehicle-edit-title"
        formData={editForm.formData}
        onChange={editForm.handleFormChange}
        onSubmit={onSubmitEdit}
        onClose={onCloseEdit}
        categories={categories}
        statuses={statuses}
        headquartersOptions={headquartersOptions}
        hqLoading={hqLoading}
        alert={editForm.formAlert && {
          ...editForm.formAlert,
          onClose: () => editForm.setFormAlert(null)
        }}
        isSubmitting={isSubmitting}
        isLoading={isEditLoading}
        submitLabel={MESSAGES.UPDATE_VEHICLE}
        {...editImageState}
      />
    </>
  );
}

export default VehicleListModals;
