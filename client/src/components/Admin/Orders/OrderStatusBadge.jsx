// src/components/Admin/Orders/OrderStatusBadge.jsx
const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (currentStatus) => {
    switch (currentStatus?.toUpperCase()) {
      case "PENDING":
        return { label: "Pendiente", className: "status-pending" };
      case "PREPARING":
      case "IN_PROGRESS":
        return { label: "En Preparación", className: "status-preparing" };
      case "DELIVERING":
      case "ON_WAY":
        return { label: "En Camino", className: "status-delivering" };
      case "DELIVERED":
      case "COMPLETED":
        return { label: "Entregado", className: "status-delivered" };
      case "CANCELLED":
      case "CANCELED":
        return { label: "Cancelado", className: "status-cancelled" };
      default:
        return { label: status || "Desconocido", className: "status-default" };
    }
  };

  const { label, className } = getStatusConfig(status);

  return <span className={`order-status-badge ${className}`}>{label}</span>;
};

export default OrderStatusBadge;