import { useEffect, useState } from "react";
import api from "@/api/axios";
import "./MyOrdersPage.scss";

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("access") ||
          localStorage.getItem("access_token");

        const response = await api.get("/orders", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = response.data;
        let ordersList = [];

        if (Array.isArray(data)) {
          ordersList = data;
        } else if (data && Array.isArray(data.docs)) {
          ordersList = data.docs;
        } else if (data && Array.isArray(data.orders)) {
          ordersList = data.orders;
        }

        setOrders(ordersList);
      } catch (err) {
        console.error("Error al cargar pedidos del cliente:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  return (
    <div className="ordersContainer">
      <h1>Mis Pedidos</h1>
      {loading ? (
        <p>Cargando tus pedidos...</p>
      ) : orders.length === 0 ? (
        <div className="ordersList">
          <p>Aún no has realizado pedidos.</p>
        </div>
      ) : (
        <div className="ordersList">
          {orders.map((order) => {
            const orderId = order._id || order.id;
            const address = order.address || order.deliveryAddress || "Sin dirección";
            const total = Number(order.total || 0).toFixed(2);

            return (
              <div
                key={orderId}
                className="orderCard"
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  backgroundColor: "#ffffff"
                }}
              >
                <h3>Pedido #{String(orderId).slice(-6).toUpperCase()}</h3>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span className={`status-${String(order.status).toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>
                <p>
                  <strong>Restaurante:</strong>{" "}
                  {order.restaurant?.name || "Restaurante"}
                </p>
                <p>
                  <strong>Dirección de Entrega:</strong> {address}
                </p>
                <p>
                  <strong>Total:</strong> S/ {total}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;