import axios from "axios";
import { ENV } from "./constants";

const authFetch = axios.create({
  baseURL: ENV.BASE_API,
});

// Interceptor para enviar el Token correspondiente según la App activa
authFetch.interceptors.request.use(
  (config) => {
    let token = ENV.GET_TOKEN();
    
    if (token) {
      // Limpia comillas dobles residuales si se guardó mal
      token = token.replace(/^"(.*)"$/, "$1").trim();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para capturar tokens expirados o desautorizados
authFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("🔒 Petición no autorizada o token caducado.");
    }
    return Promise.reject(error);
  }
);

export { authFetch };