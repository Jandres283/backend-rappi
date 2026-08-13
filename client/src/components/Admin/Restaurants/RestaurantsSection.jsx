import { useNavigate } from "react-router-dom";

// URL base del backend
const API_URL = "http://localhost:3977";
const DEFAULT_IMAGE = "https://via.placeholder.com/400x200?text=Sin+Imagen";

// Helper para construir la URL completa de la imagen
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_URL}${cleanPath}`;
};

export const RestaurantsSection = ({ 
  restaurantes = [], 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  onViewMenu,
  onAddNew 
}) => {
  const navigate = useNavigate();

  const handleMenuClick = (restaurant) => {
    if (onViewMenu) {
      onViewMenu(restaurant);
    } else {
      const id = restaurant._id || restaurant.id;
      navigate(`/admin/products?restaurantId=${id}`);
    }
  };

  return (
    <section className="restaurants-section">
      <div className="section-header">
        <h2>Restaurantes Registrados</h2>
        <button className="see-all-btn" onClick={onAddNew}>
          + Registrar Nuevo
        </button>
      </div>

      {/* Si no hay restaurantes registrados */}
      {!restaurantes || restaurantes.length === 0 ? (
        <div className="empty-state">
          <p>No hay restaurantes registrados por el momento.</p>
          <button onClick={onAddNew}>Registrar Primer Restaurante</button>
        </div>
      ) : (
        /* Grilla de tarjetas de restaurantes */
        <div className="restaurants-grid">
          {restaurantes.map((restaurant) => {
            // Normalización defensiva de datos
            const id = restaurant._id || restaurant.id;
            const name = restaurant.name || restaurant.nombre || "Sin nombre";
            const rawImage = restaurant.image || restaurant.logo || restaurant.imagenUrl || restaurant.avatar;
            const finalImageUrl = getImageUrl(rawImage);
            const isOpen = restaurant.isOpen ?? restaurant.abierto ?? restaurant.isActive ?? true;
            const category = restaurant.category || restaurant.categoria;
            const description = restaurant.description || restaurant.descripcion || "Sin descripción disponible.";
            const address = restaurant.address || restaurant.direccion || "Dirección no especificada";
            const phone = restaurant.phone || restaurant.telefono || "Sin teléfono";
            const deliveryTime = restaurant.deliveryTime || restaurant.tiempoEntrega || '20-30 min';
            const shippingCost = restaurant.shippingCost ?? restaurant.costoEnvio ?? 0;

            return (
              <div key={id} className="restaurant-card">
                
                {/* === CABECERA: IMAGEN + CONTROLES SOBREPUESTOS === */}
                <div className="card-image-wrapper">
                  
                  {/* Imagen del Restaurante con Manejo de Errores */}
                  <img 
                    src={finalImageUrl || DEFAULT_IMAGE} 
                    alt={name} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />

                  {/* Botones de Control Flotantes */}
                  <div className="card-controls-overlay">
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-power" 
                        title={isOpen ? "Cerrar restaurante" : "Abrir restaurante"}
                        onClick={() => onToggleStatus && onToggleStatus(id, !isOpen)}
                      >
                        ⏻
                      </button>
                      <button 
                        className="btn-icon btn-edit" 
                        title="Editar restaurante"
                        onClick={() => onEdit && onEdit(restaurant)}
                      >
                        ✏️
                      </button>
                      {onDelete && (
                        <button 
                          className="btn-icon btn-delete" 
                          title="Eliminar restaurante"
                          onClick={() => onDelete(id)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    <span className={`status-badge ${isOpen ? '' : 'closed'}`}>
                      {isOpen ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>

                  {/* Etiqueta de Categoría */}
                  {category && (
                    <span className="category-tag-overlay">
                      {category}
                    </span>
                  )}
                </div>

                {/* === CUERPO DE LA TARJETA === */}
                <div className="card-content">
                  <h3>{name}</h3>
                  <p className="description">{description}</p>

                  {/* Cuadro de Info de Contacto y Envíos */}
                  <div className="info-box">
                    <div className="info-row">
                      <span className="icon">📍</span> 
                      <span>{address}</span>
                    </div>
                    <div className="info-row">
                      <span className="icon">📞</span> 
                      <span>{phone}</span>
                    </div>

                    <div className="info-footer-row">
                      <span className="time-info">
                        🕒 {deliveryTime}
                      </span>
                      <span className="shipping-info">
                        $ Envío: S/ {Number(shippingCost).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Botón Acción Principal */}
                  <button 
                    className="btn-view-menu" 
                    onClick={() => handleMenuClick(restaurant)}
                  >
                    🍴 Ver Menú / Platillos
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RestaurantsSection;