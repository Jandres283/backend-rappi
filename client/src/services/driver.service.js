import api from "@/api/axios";

export const driverService = {
  register: async (driverData) => {
    const response = await api.post("/drivers/register", driverData);
    return response.data;
  },

  updateStatus: async (driverId, isAvailable) => {
    const response = await api.patch(`/drivers/${driverId}/status`, { isAvailable });
    return response.data;
  },

  getAssignedOrders: async (driverId) => {
    const response = await api.get(`/drivers/${driverId}/orders`);
    return response.data;
  },
};