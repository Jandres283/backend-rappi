import api from "@/api/axios";

export const restaurantService = {
  getAll: async () => {
    const response = await api.get("/restaurants");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  register: async (restaurantData) => {
    const response = await api.post("/restaurants/register", restaurantData);
    return response.data;
  },

  updateStatus: async (id, isOpen) => {
    const response = await api.patch(`/restaurants/${id}/status`, { isOpen });
    return response.data;
  },
};