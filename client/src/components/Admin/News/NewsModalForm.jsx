import { useState } from "react";

const NewsModalForm = ({ isOpen, onClose, onSubmit, currentNews }) => {
  // Inicializamos derivando directamente de currentNews.
  // Como en el componente padre le asignamos un `key` único cuando cambia `currentNews`,
  // React destruirá y creará el estado con los valores actualizados sin necesitar useEffect.
  const [formData, setFormData] = useState(() => ({
    title: currentNews?.title || "",
    category: currentNews?.category || "Lanzamientos",
    content: currentNews?.content || "",
    file: null,
  }));

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("category", formData.category);
      body.append("content", formData.content);
      if (formData.file) {
        body.append("file", formData.file);
      }

      onSubmit(body);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{currentNews ? "Editar Noticia" : "Nueva Noticia"}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="news-title">Título</label>
            <input
              id="news-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej. ¡Lanzamiento de Prime Delivery!"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="news-category">Categoría</label>
            <select
              id="news-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Lanzamientos">Lanzamientos</option>
              <option value="Promociones">Promociones</option>
              <option value="Ofertas">Ofertas</option>
              <option value="Novedades">Novedades</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="news-content">Contenido / Descripción</label>
            <textarea
              id="news-content"
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              placeholder="Escribe el detalle del anuncio..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="news-file">Imagen de la Noticia</label>
            <input
              id="news-file"
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {currentNews ? "Guardar Cambios" : "Crear Noticia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsModalForm;