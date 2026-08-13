require("dotenv").config();

const PORT = process.env.PORT || 3977;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const API_VERSION = process.env.API_VERSION || "v1";
const IP_SERVER = process.env.IP_SERVER || "localhost";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_key_default";

const ENV = {
  SERVER_HOST: `http://${IP_SERVER}:${PORT}`,
  BASE_PATH: `http://${IP_SERVER}:${PORT}`,
  API_URL: `http://${IP_SERVER}:${PORT}/api/${API_VERSION}`,
};

const ROLES = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  RESTAURANT: "RESTAURANT",
  DRIVER: "DRIVER",
};

// Se agregan todos los estados del ciclo de vida del pedido
const ORDER_STATUS = {
  PENDING: "PENDING",
  PREPARING: "PREPARING",
  READY: "READY",
  IN_DELIVERY: "IN_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

module.exports = {
  PORT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  API_VERSION,
  IP_SERVER,
  JWT_SECRET_KEY,
  ENV,
  ROLES,
  ORDER_STATUS,
};