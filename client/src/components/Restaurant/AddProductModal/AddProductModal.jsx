import { useState } from "react";
import "./AddProductModal.scss";

const AddProductModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear la estructura Multipart/FormData requerida por el backend POST /product
    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("description", formData.description);
    multipartData.append("price", formData.price);

    if (imageFile) {
      multipartData.append("image", imageFile);
    }

    if (onSubmit) {
      onSubmit(multipartData);
    }
  };

  return (
    <div className="add-product-modal-overlay" onClick={onClose}>
      <div
        className="add-product-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Agregar Nuevo Platillo</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="product-title">Nombre del Platillo</label>
              <input
                id="product-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Hamburguesa Doble Queso"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="product-price">Precio ($)</label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="12.50"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="product-description">Descripción</label>
              <textarea
                id="product-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingredientes principales, detalles..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="product-image">Imagen del Platillo</label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Vista previa del producto" />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creando Platillo..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;