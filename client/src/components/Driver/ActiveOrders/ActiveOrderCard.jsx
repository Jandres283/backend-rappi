

const ActiveOrderCard = ({ activeOrder, onCompleteOrder, isLoading }) => {
  if (!activeOrder) {
    return (
      <div className="driver-card-empty">
        <p>No tienes ningún pedido activo en curso. 🛵</p>
      </div>
    );
  }

  // Fallbacks para datos que varían entre la BD y la respuesta de la API
  const orderId = activeOrder._id || activeOrder.id;
  const restaurantName = activeOrder.restaurant?.name || activeOrder.restaurantName || "Restaurante";
  
  // Direcciones de Origen (Restaurante) y Destino (Cliente)
  const restaurantAddress =
    activeOrder.restaurant?.address ||
    activeOrder.restaurantAddress ||
    "Dirección del restaurante no disponible";

  const deliveryAddress =
    activeOrder.deliveryAddress ||
    activeOrder.address ||
    "Dirección de entrega no especificada";

  // Datos del Cliente
  const clientObj = activeOrder.user || activeOrder.client || activeOrder.customer;
  const clientName = clientObj
    ? `${clientObj.firstName || ""} ${clientObj.lastName || ""}`.trim() || clientObj.name || clientObj.email
    : "Cliente";

  const clientPhone = clientObj?.phone || activeOrder.phone || activeOrder.clientPhone || null;

  const statusText = activeOrder.status || "EN CAMINO";

  // 🗺️ RUTA DE GOOGLE MAPS (Repartidor -> Restaurante -> Cliente)
  const handleOpenGoogleMaps = () => {
    const origin = "My+Location"; // Toma el GPS del teléfono del repartidor
    const waypoint = encodeURIComponent(restaurantAddress); // Parada 1: Restaurante
    const destination = encodeURIComponent(deliveryAddress); // Parada 2: Cliente

    // Enlace directo a Google Maps con waypoint (parada intermedia)
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoint}&travelmode=driving`;

    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="active-order-container">
      <div className="active-order-card">
        <div className="card-header">
          <h3>Pedido en Curso #{orderId ? String(orderId).slice(-6).toUpperCase() : ""}</h3>
          <span className={`status-badge status-${statusText.toLowerCase().replace(/\s+/g, "-")}`}>
            {statusText}
          </span>
        </div>

        <div className="card-body">
          {/* Restaurante (Origen) */}
          <div className="info-row">
            <strong>🏪 Restaurante (Recogida):</strong>
            <span>{restaurantName} — <small className="text-muted">{restaurantAddress}</small></span>
          </div>

          {/* Cliente (Destino) */}
          <div className="info-row">
            <strong>👤 Cliente:</strong>
            <span>
              {clientName}{" "}
              {clientPhone && (
                <a href={`tel:${clientPhone}`} className="phone-link">
                  ({clientPhone})
                </a>
              )}
            </span>
          </div>

          {/* Dirección Entrega */}
          <div className="info-row highlight-row">
            <strong>📍 Entregar en:</strong>
            <span className="address-text">{deliveryAddress}</span>
          </div>
        </div>

        {/* Sección de Navegación GPS */}
        <div className="delivery-map-wrapper">
          <div className="map-header">
            <div className="map-title-info">
              <strong>🗺️ Ruta de Entrega Integrada</strong>
              <small>Origen ➔ {restaurantName} ➔ {clientName}</small>
            </div>

            <button type="button" className="btn-open-gps" onClick={handleOpenGoogleMaps}>
              🚀 Abrir GPS en Google Maps
            </button>
          </div>
        </div>

        <div className="card-footer">
          <button
            className="btn-driver-complete"
            onClick={() => onCompleteOrder && onCompleteOrder(orderId)}
            disabled={isLoading}
          >
            {isLoading ? "Actualizando..." : "✅ Marcar como Entregado"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveOrderCard;