import api from "@/api/axios";

export const clientService = {
  getAll: async () => {
    const response = await api.get("/clients");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  updateProfile: async (id, data) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },
};