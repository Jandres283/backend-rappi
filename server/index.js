// ./index.js
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require("./app");

// Importaciones modularizadas
const initSocket = require("./utils/socket");
const { cleanObsoleteIndexes } = require("./utils/dbHelpers");
const { 
  API_VERSION, 
  IP_SERVER, 
  PORT: CONST_PORT, 
  DB_USER, 
  DB_PASSWORD, 
  DB_HOST 
} = require("./constants");

// 1. Servidor HTTP y WebSockets
const server = http.createServer(app);
initSocket(server, app);

// 2. URI Dinámica (construida desde tu .env) y Puerto
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || CONST_PORT || 3977;

console.log("LA URI DETECTADA ES: ", MONGO_URI);

// 3. Conexión y Arranque
mongoose.connect(MONGO_URI)
  .then(async () => {
    // Limpieza de índice de la base de datos
    await cleanObsoleteIndexes();

    server.listen(PORT, () => {
      console.log("----------------------------------------------");
      console.log("🟢 LA CONEXIÓN DE LA BASE DE DATOS FUE EXITOSA");
      console.log(`🚀 Servidor corriendo en: http://${IP_SERVER}:${PORT}`);
      console.log(`🌐 API Endpoint: http://${IP_SERVER}:${PORT}/api/${API_VERSION.toLowerCase()}`);
      console.log("----------------------------------------------");
    });
  }) 
  .catch((error) => {
    console.error("❌ Error de conexión a la base de datos:", error.message);
  });