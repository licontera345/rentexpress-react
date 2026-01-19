import './ImageUpload.css';

function ImageUpload({ imageFile, imagePreview, onImageChange, onRemove, currentImage }) {
  return (
    <div className="form-section">
      <h3>Imagen Principal</h3>
      
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
          <span>{imageFile ? 'Cambiar imagen' : 'Selecciona una imagen'}</span>
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
