const express = require("express");
const OrderController = require("../controllers/order");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");

const api = express.Router();

// Middleware helper por si el middleware se exporta como asureAuth o ensureAuth
const authenticate = mdAuth.asureAuth || mdAuth.ensureAuth;

// ======================================================
// 1. RUTAS ESPECÍFICAS / ADMIN (Deben ir primero)
// ======================================================
api.get(
  "/admin/orders/client-history/:clientId",
  [authenticate, mdRole.isAdmin],
  OrderController.getClientOrderHistory
);

// ======================================================
// 2. RUTAS CREACIÓN (POST)
// ======================================================
api.post("/order", [authenticate], OrderController.createOrder);
api.post("/orders", [authenticate], OrderController.createOrder);

// ======================================================
// 3. RUTAS CONSULTA LECTURA (GET)
// ======================================================
api.get("/orders", [authenticate], OrderController.getOrders);
api.get("/order/:id", [authenticate], OrderController.getOrder);
api.get("/orders/:id", [authenticate], OrderController.getOrder);

// ======================================================
// 4. RUTAS ACTUALIZACIÓN DE ESTADO / DRIVER (PATCH / PUT)
// ======================================================
// Endpoints estándar en plural
api.patch("/orders/:id/status", [authenticate], OrderController.updateOrderStatus);
api.put("/orders/:id/status", [authenticate], OrderController.updateOrderStatus);
api.patch("/orders/:id", [authenticate], OrderController.updateOrderStatus);
api.put("/orders/:id", [authenticate], OrderController.updateOrderStatus);

// Respaldo de endpoints en singular
api.patch("/order/status/:id", [authenticate], OrderController.updateOrderStatus);
api.put("/order/status/:id", [authenticate], OrderController.updateOrderStatus);
api.patch("/order/:id", [authenticate], OrderController.updateOrderStatus);
api.put("/order/:id", [authenticate], OrderController.updateOrderStatus);

module.exports = api;