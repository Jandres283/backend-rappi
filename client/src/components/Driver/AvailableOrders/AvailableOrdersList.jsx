
import AcceptOrderButton from "./AcceptOrderButton";

export const AvailableOrdersList = ({ orders = [], onAccept, isLoading }) => {
  // Estado de carga inicial/global
  if (isLoading) {
    return (
      <div className="driver-loading">
        <div className="spinner"></div>
        <p>🔎 Buscando pedidos disponibles cerca de ti...</p>
      </div>
    );
  }

  // Si no hay pedidos en cola
  if (!orders || orders.length === 0) {
    return (
      <div className="empty-panel">
        <div className="empty-icon">📦</div>
        <h4>No hay pedidos disponibles</h4>
        <p>En este momento no hay órdenes pendientes o listas para recoger en tu zona.</p>
      </div>
    );
  }

  return (
    <div className="available-orders-list">
      {orders.map((order) => {
        const id = order._id || order.id;

        // 🏪 Datos del Restaurante (Origen)
        const restaurantName =
          order.restaurant?.name || order.restaurantName || "Restaurante Aliado";
        const restaurantAddress =
          order.restaurant?.address ||
          order.restaurantAddress ||
          "Dirección del restaurante no especificada";

        // 👤 Datos del Cliente (Destino)
        const rawFirstName = order.user?.firstName || order.user?.name || order.clientName || "";
        const rawLastName = order.user?.lastName || "";
        const clientName = `${rawFirstName} ${rawLastName}`.trim() || "Cliente Rappi";

        const clientPhone =
          order.user?.phone ||
          order.clientPhone ||
          order.phone ||
          "Sin teléfono";

        const deliveryAddress =
          order.deliveryAddress || order.address || "Dirección no especificada";

        // 📦 Resumen de Ítems / Productos
        const itemCount = order.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

        // 💳 Pago y Total
        const paymentMethod =
          order.paymentMethod || order.paymentType || "Efectivo";
        const rawTotal = order.total ?? order.totalPrice ?? 0;
        const numericTotal = Number(rawTotal) || 0;
        const formattedTotal = numericTotal.toFixed(2);

        return (
          <article key={id} className="available-order-item">
            {/* Encabezado: Restaurante y Método de Pago */}
            <div className="card-header">
              <div className="restaurant-badge">
                <span className="icon">🏪</span>
                <div>
                  <h4>{restaurantName}</h4>
                  <p className="sub-address">📍 Recogida: {restaurantAddress}</p>
                </div>
              </div>
              <span className={`payment-tag ${paymentMethod.toLowerCase()}`}>
                {paymentMethod.toUpperCase()}
              </span>
            </div>

            <hr className="divider" />

            {/* Detalles del Cliente y Paquete */}
            <div className="card-body">
              <div className="info-group">
                <span className="label">👤 Entrega a:</span>
                <span className="value bold">{clientName}</span>
              </div>

              <div className="info-group">
                <span className="label">📞 Teléfono:</span>
                <span className="value">
                  {clientPhone !== "Sin teléfono" ? (
                    <a href={`tel:${clientPhone}`} className="phone-link">
                      {clientPhone}
                    </a>
                  ) : (
                    <span className="text-muted">Sin teléfono</span>
                  )}
                </span>
              </div>

              <div className="info-group full-width">
                <span className="label">📍 Dirección de Destino:</span>
                <span className="value address-highlight">{deliveryAddress}</span>
              </div>

              {itemCount > 0 && (
                <div className="info-group full-width items-summary">
                  <span className="label">📦 Paquete:</span>
                  <span className="value badge-items">
                    {itemCount} {itemCount === 1 ? "producto" : "productos"}
                  </span>
                </div>
              )}
            </div>

            <hr className="divider" />

            {/* Pie de Tarjeta: Cobro y Botón de Aceptar */}
            <div className="card-footer">
              <div className="price-box">
                <span className="price-label">Monto a cobrar</span>
                <span className="price-amount">S/ {formattedTotal}</span>
              </div>

              <div className="action-box">
                <AcceptOrderButton
                  orderId={id}
                  onAccept={onAccept}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AvailableOrdersList;