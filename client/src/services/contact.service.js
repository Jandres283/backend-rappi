import api from "@/api/axios";

export const contactService = {
  /**
   * Obtiene todos los mensajes de contacto (Para el panel Admin)
   */
  getAllContacts: async () => {
    const response = await api.get("/contacts");
    return response.data;
  },

  /**
   * Obtiene un contacto/mensaje específico por su ID
   */
  getContactById: async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  /**
   * Envía un nuevo mensaje desde el formulario web
   */
  createContact: async (contactData) => {
    const response = await api.post("/contacts", contactData);
    return response.data;
  },

  /**
   * Envía una respuesta al cliente desde el panel Admin
   */
  replyContact: async (id, replyData) => {
    const response = await api.put(`/contacts/${id}/reply`, replyData);
    return response.data;
  },

  /**
   * Actualiza el estado del ticket de contacto (PENDING, IN_PROGRESS, RESOLVED)
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`/contacts/${id}/status`, { status });
    return response.data;
  },

  /**
   * Elimina un registro de contacto por su ID
   */
  deleteContact: async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },

  /**
   * Registra una reclamación / queja en el Libro de Reclamaciones
   */
  createClaim: async (claimData) => {
    const response = await api.post("/claims", claimData);
    return response.data;
  },
};

export default contactService;