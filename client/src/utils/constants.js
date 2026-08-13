const SERVER_HOST = import.meta.env.VITE_SERVER_HOST || "https://backend-rappi.onrender.com";
const API_URL = import.meta.env.VITE_API_URL || "https://backend-rappi.onrender.com/api/v1";

export const ENV = {
  API_URL: API_URL,
  BASE_API: API_URL,

  SERVER_HOST: SERVER_HOST,
  BASE_PATH: SERVER_HOST,
  
  CART_KEY: "app_cart",

  // Función helper para obtener el token dinámicamente según la ruta
  GET_TOKEN: () => {
    if (typeof window === "undefined") return null;
    const path = window.location.pathname.toLowerCase();

    let role = "client";
    if (path.startsWith("/admin")) role = "admin";
    else if (path.startsWith("/driver") || path.startsWith("/repartidor")) role = "driver";
    else if (path.startsWith("/restaurant") || path.startsWith("/socio")) role = "restaurant";

    return (
      localStorage.getItem(`${role}_token_jwt`) ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token_jwt")
    );
  },

  STORAGE: {
    CART: "app_cart",
  },
};

export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  DRIVER: "driver",
  RESTAURANT: "restaurant",
};

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PREPARING: "PREPARING",
  READY: "READY",
  IN_DELIVERY: "IN_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};