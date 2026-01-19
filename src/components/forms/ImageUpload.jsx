import './ImageUpload.css';
import { MESSAGES } from '../../constants';

function ImageUpload({ imageFile, imagePreview, onImageChange, onRemove, currentImage }) {
  return (
    <div className="form-section">
      <h3>{MESSAGES.UPLOAD_IMAGE}</h3>
      
      {currentImage && !imagePreview && (
        <div className="current-image">
          <img src={currentImage} alt="Imagen actual" />
          <p>Imagen actual</p>
        </div>
      )}
      
      <div className="image-upload">
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          id="vehicle-image"
          className="image-input"
        />
        <label htmlFor="vehicle-image" className="image-label">
          <span>📸</span>
          <span>{imageFile ? MESSAGES.REMOVE_IMAGE : MESSAGES.UPLOAD_IMAGE}</span>
          <small>PNG, JPG o WebP (máx. 5MB)</small>
        </label>
        
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button 
              type="button"
              onClick={onRemove}
              className="remove-image"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
