import api from "@/api/axios";

export const userService = {
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  updateRole: async (userId, role) => {
    // Corregido: Se envía { role } mediante la ruta que soporta el backend PATCH /users/:id
    const response = await api.patch(`/users/${userId}`, { role });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};