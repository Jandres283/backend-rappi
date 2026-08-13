import api from "@/api/axios";

export const authService = {
  login: async (credentials) => {
    // Corregido: Se ajusta al endpoint exacto del backend (/users/login)
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    // Corregido: Se ajusta al endpoint exacto del backend (/users/register)
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  getProfile: async () => {
    // Corregido: El token se inyecta automáticamente gracias al interceptor de api (/user/me)
    const response = await api.get("/user/me");
    return response.data;
  },
};