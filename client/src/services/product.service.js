import api from "@/api/axios";

export const productService = {
  // Obtener todos los productos
  getAll: async () => {
    const response = await api.get("/products");
    // Normalizar si la respuesta viene dentro de 'docs' (paginate) o array directo
    return response.data?.docs || response.data;
  },

  // Obtener por ID (Corregido a singular '/product/ID')
  getById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  // Obtener por Restaurante (Corregido a '/products?restaurant=ID')
  getByRestaurant: async (restaurantId) => {
    const response = await api.get(`/products?restaurant=${restaurantId}`);
    // Normalizar la respuesta por si usa mongoose-paginate
    return response.data?.docs || response.data;
  },

  // Crear producto
  create: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },
};