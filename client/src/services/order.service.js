import api from "@/api/axios";

export const orderService = {
  create: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  updateStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};