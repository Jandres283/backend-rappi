import { useState } from "react";

const RestaurantFormModal = ({ isOpen, onClose, onSubmit, restaurant }) => {
  const [prevRestaurant, setPrevRestaurant] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "",
  });

  // Sincronización de estado cuando cambian las props (sin useEffect para 0 errores de linter)
  if (restaurant !== prevRestaurant || isOpen !== prevIsOpen) {
    setPrevRestaurant(restaurant);
    setPrevIsOpen(isOpen);
    setFormData({
      name: restaurant ? (restaurant.name || restaurant.nombre || "") : "",
      email: restaurant ? (restaurant.email || "") : "",
      phone: restaurant ? (restaurant.phone || restaurant.telefono || "") : "",
      address: restaurant ? (restaurant.address || restaurant.direccion || "") : "",
      category: restaurant ? (restaurant.category || restaurant.categoria || "") : "",
    });
  }

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{restaurant ? "Editar Restaurante" : "Nuevo Restaurante"}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="rest-name">Nombre del Restaurante</label>
            <input
              id="rest-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rest-email">Email de Contacto</label>
            <input
              id="rest-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rest-phone">Teléfono</label>
            <input
              id="rest-phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rest-address">Dirección</label>
            <input
              id="rest-address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rest-category">Categoría</label>
            <input
              id="rest-category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantFormModal;