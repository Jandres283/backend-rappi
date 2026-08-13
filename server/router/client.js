const express = require("express");
const ClientController = require("../controllers/client");
const mdAuth = require("../middlewares/authenticated");

const api = express.Router();

// ======================================================
// RUTAS EXCLUSIVAS DEL CLIENTE (Requieren Token)
// ======================================================

// Perfil del cliente
api.get("/client/me", [mdAuth.asureAuth], ClientController.getProfile);

// Gestión de direcciones
api.post("/client/address", [mdAuth.asureAuth], ClientController.addAddress);
api.patch("/client/address/:addressId/default", [mdAuth.asureAuth], ClientController.setDefaultAddress);
api.delete("/client/address/:addressId", [mdAuth.asureAuth], ClientController.deleteAddress);

// Preferencia de Pago
api.patch("/client/payment-method", [mdAuth.asureAuth], ClientController.updatePaymentMethod);

// Favoritos
api.post("/client/favorite-restaurant", [mdAuth.asureAuth], ClientController.toggleFavoriteRestaurant);
api.post("/client/favorite-product", [mdAuth.asureAuth], ClientController.toggleFavoriteProduct);

// Historial de pedidos
api.get("/client/my-orders", [mdAuth.asureAuth], ClientController.getMyOrders);

module.exports = api;