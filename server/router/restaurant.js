const express = require("express");
const upload = require("../middlewares/multer"); 
const RestaurantController = require("../controllers/restaurant");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");

const api = express.Router();
const authMiddleware = mdAuth.asureAuth || mdAuth.ensureAuth;

/* ==========================================================================
   RUTAS PÚBLICAS
   ========================================================================== */

// Registro público de restaurante
api.post(
  "/restaurant/register",
  upload("restaurant").single("image"),
  RestaurantController.registerRestaurant
);

// Consultas públicas
api.get("/restaurants", RestaurantController.getRestaurants);

/* ==========================================================================
   RUTAS PROTEGIDAS ESPECÍFICAS (DEBEN IR ANTES DE /:id)
   ========================================================================== */

// Obtener restaurante del usuario autenticado
api.get(
  "/restaurant/me",
  authMiddleware,
  RestaurantController.getMe
);

api.get(
  "/restaurants/me",
  authMiddleware,
  RestaurantController.getMe
);

/* ==========================================================================
   RUTAS CON PARÁMETROS Y ESCRITURA
   ========================================================================== */

api.get("/restaurant", RestaurantController.getRestaurants);
api.get("/restaurant/:id", RestaurantController.getRestaurant);

// Crear restaurante
api.post(
  "/restaurant",
  authMiddleware,
  mdRole.isRestaurantOrAdmin,
  upload("restaurant").single("image"),
  RestaurantController.createRestaurant
);

// Actualizar restaurante (Soporte PATCH y PUT)
api.patch(
  "/restaurant/:id",
  authMiddleware,
  mdRole.isRestaurantOrAdmin,
  upload("restaurant").single("image"),
  RestaurantController.updateRestaurant
);

api.put(
  "/restaurant/:id",
  authMiddleware,
  mdRole.isRestaurantOrAdmin,
  upload("restaurant").single("image"),
  RestaurantController.updateRestaurant
);

// Eliminar restaurante (Solo Admin)
api.delete(
  "/restaurant/:id",
  authMiddleware,
  mdRole.isAdmin,
  RestaurantController.deleteRestaurant
);

module.exports = api;