const express = require("express");
const DriverController = require("../controllers/driver");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");

const api = express.Router();

// Perfil, Disponibilidad y Ubicación
api.post("/driver/profile", [mdAuth.asureAuth], DriverController.upsertDriverProfile);
api.patch("/driver/availability", [mdAuth.asureAuth], DriverController.toggleAvailability);
api.patch("/driver/location", [mdAuth.asureAuth], DriverController.updateLocation);

// Órdenes Dashboard Repartidor
api.get("/driver/orders/available", [mdAuth.asureAuth], DriverController.getAvailableOrders);
api.get("/orders/driver/available", [mdAuth.asureAuth], DriverController.getAvailableOrders);

api.get("/driver/orders/active", [mdAuth.asureAuth], DriverController.getActiveOrder);
api.get("/orders/driver/active", [mdAuth.asureAuth], DriverController.getActiveOrder);

api.patch("/driver/accept-order/:orderId", [mdAuth.asureAuth], DriverController.acceptOrder);
api.patch("/driver/orders/:id/accept", [mdAuth.asureAuth], DriverController.acceptOrder);
api.patch("/orders/:id/accept", [mdAuth.asureAuth], DriverController.acceptOrder);

api.patch("/driver/orders/:id/complete", [mdAuth.asureAuth], DriverController.completeOrder);
api.patch("/orders/:id/complete", [mdAuth.asureAuth], DriverController.completeOrder);

// Vista Admin
api.get("/drivers", [mdAuth.asureAuth, mdRole.isAdmin], DriverController.getDrivers);

module.exports = api;