import { MESSAGES } from '../../../constants';

function ProfileImageField({
  imageSrc,
  isDisabled,
  fileError,
  onFileChange,
  onRemoveSelectedFile,
  selectedFileName,
  previewSrc
}) {
  const shownImage = previewSrc || imageSrc;

  return (
    <section className="profile-section profile-image-section">
      <div className="vehicle-create-section-header">
        <h3>{MESSAGES.UPLOAD_IMAGE}</h3>
      </div>

      <div className="vehicle-form-image-layout profile-image-layout">
        <div className="vehicle-form-image-preview-wrapper profile-image-preview-wrapper">
          {shownImage && (
            <img
              className="vehicle-form-image-preview"
              src={shownImage}
              alt={MESSAGES.UPLOAD_IMAGE}
            />
          )}
          {!shownImage && (
            <span className="vehicle-form-image-placeholder-label">{MESSAGES.NO_IMAGE}</span>
          )}
        </div>

        <div className="vehicle-form-image-controls">
          <input
            type="file"
            name="profileImage"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onFileChange}
            disabled={isDisabled}
          />
          {selectedFileName && (
            <p className="vehicle-form-image-file-name">{selectedFileName}</p>
          )}
          {fileError && (
            <p className="form-error" role="alert">{fileError}</p>
          )}
          {(selectedFileName || shownImage) && (
            <button
              type="button"
              className="btn-close-footer"
              onClick={onRemoveSelectedFile}
              disabled={isDisabled}
            >
              {MESSAGES.REMOVE_IMAGE}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileImageField;
