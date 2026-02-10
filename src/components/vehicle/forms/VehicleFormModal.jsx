import Alert from '../../common/feedback/Alert';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import VehicleCostSection from './VehicleCostSection';
import VehicleFormFooter from './VehicleFormFooter';
import VehicleFormHeader from './VehicleFormHeader';
import VehicleFormIntro from './VehicleFormIntro';
import VehicleIdentificationSection from './VehicleIdentificationSection';
import VehicleImageSection from './VehicleImageSection';
import VehicleOperationSection from './VehicleOperationSection';
import { MESSAGES } from '../../../constants';

// Componente VehicleFormModal que define la interfaz y organiza la lógica de esta vista.

function VehicleFormModal({
  isOpen,
  title,
  description,
  titleId,
  formData,
  onChange,
  onSubmit,
  onClose,
  categories,
  statuses,
  headquartersOptions,
  hqLoading,
  alert,
  isSubmitting,
  submitLabel,
  isLoading = false,
  imageSrc,
  hasImage,
  fileError,
  onFileChange,
  onRemoveSelectedFile,
  selectedFileName,
  previewSrc
}) {
  const isDisabled = isSubmitting || isLoading;
  const modalTitleId = titleId || 'vehicle-form-title';

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      onClick={onClose}
    >
      <div className="modal-dialog vehicle-create-modal" onClick={stopPropagation}>
        <VehicleFormHeader title={title} titleId={modalTitleId} onClose={onClose} />

        <div className="modal-body">
          <VehicleFormIntro description={description} />

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={alert.onClose}
            />
          )}

          {isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}

          <form className="vehicle-create-form" onSubmit={onSubmit}>
            <VehicleIdentificationSection
              formData={formData}
              onChange={onChange}
              isDisabled={isDisabled}
            />
            <VehicleOperationSection
              formData={formData}
              onChange={onChange}
              categories={categories}
              statuses={statuses}
              headquartersOptions={headquartersOptions}
              isDisabled={isDisabled}
              hqLoading={hqLoading}
            />

            <VehicleImageSection
              imageSrc={imageSrc}
              hasImage={hasImage}
              isDisabled={isDisabled}
              fileError={fileError}
              onFileChange={onFileChange}
              onRemoveSelectedFile={onRemoveSelectedFile}
              selectedFileName={selectedFileName}
              previewSrc={previewSrc}
            />
            <VehicleCostSection
              formData={formData}
              onChange={onChange}
              isDisabled={isDisabled}
            />
            <VehicleFormFooter
              onClose={onClose}
              submitLabel={submitLabel}
              isDisabled={isDisabled}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default VehicleFormModal;
