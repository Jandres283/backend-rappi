// URL base del backend
const API_URL = "http://localhost:3977";
const DEFAULT_IMAGE = "https://via.placeholder.com/150?text=Sin+Imagen";

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

const RestaurantApprovalTable = ({
  restaurants = [],
  onViewDetails,
  onToggleStatus,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="admin-loading">Cargando restaurantes...</div>;
  }

  if (!restaurants || restaurants.length === 0) {
    return <div className="admin-empty">No hay restaurantes registrados.</div>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => {
            const id = restaurant._id || restaurant.id;
            const name = restaurant.name || restaurant.nombre || "Sin nombre";
            const email = restaurant.email || "N/A";
            const category = restaurant.category || restaurant.categoria || "General";
            const rawImage = restaurant.image || restaurant.logo || restaurant.imagenUrl || restaurant.avatar;
            const finalImageUrl = getImageUrl(rawImage);
            const isActive = restaurant.active ?? restaurant.isActive ?? restaurant.abierto ?? false;

            return (
              <tr key={id}>
                <td>
                  <img
                    src={finalImageUrl || DEFAULT_IMAGE}
                    alt={name}
                    className="table-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{category}</td>
                <td>
                  <span
                    className={`status-badge ${
                      isActive ? "status-active" : "status-inactive"
                    }`}
                  >
                    {isActive ? "Activo / Aprobado" : "Pendiente / Inactivo"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onViewDetails && onViewDetails(restaurant)}
                  >
                    Editar
                  </button>
                  {onToggleStatus && (
                    <button
                      className={`btn-action ${
                        isActive ? "btn-delete" : "btn-primary"
                      }`}
                      onClick={() => onToggleStatus(id, !isActive)}
                    >
                      {isActive ? "Desactivar" : "Aprobar"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantApprovalTable;