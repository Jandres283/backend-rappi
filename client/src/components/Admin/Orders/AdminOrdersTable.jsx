// src/components/Admin/Orders/AdminOrdersTable.jsx
import OrderStatusBadge from "./OrderStatusBadge";

const AdminOrdersTable = ({ orders = [], onViewDetails, onUpdateStatus, isLoading }) => {
  if (isLoading) {
    return <div className="admin-loading">Cargando pedidos...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="admin-empty">No hay pedidos registrados.</div>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Restaurante</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const orderId = order._id || order.id;
            return (
              <tr key={orderId}>
                <td>#{orderId ? orderId.slice(-6).toUpperCase() : "N/A"}</td>
                <td>{order.client?.name || order.client?.email || "Cliente N/A"}</td>
                <td>{order.restaurant?.name || "Restaurante N/A"}</td>
                <td>
                  ${typeof order.total === "number" ? order.total.toFixed(2) : order.total}
                </td>
                <td>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onViewDetails && onViewDetails(order)}
                  >
                    Detalles
                  </button>
                  {onUpdateStatus && (
                    <select
                      className="btn-action-select"
                      value={order.status || ""}
                      onChange={(e) => onUpdateStatus(orderId, e.target.value)}
                    >
                      <option value="" disabled>Cambiar estado...</option>
                      <option value="PENDING">Pendiente</option>
                      <option value="PREPARING">En Preparación</option>
                      <option value="DELIVERING">En Camino</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
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

export default AdminOrdersTable;