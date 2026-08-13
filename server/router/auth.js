const express = require("express");
const multiparty = require("connect-multiparty");
const AuthController = require("../controllers/auth");
const md_auth = require("../middlewares/authenticated");

const mdUpload = multiparty({ uploadDir: "./uploads/avatars" });
const api = express.Router();

// ======================================================
// RUTAS PÚBLICAS DE REGISTRO
// ======================================================
api.post("/auth/registerClient", [mdUpload], AuthController.registerClient);
api.post("/auth/registerRestaurant", [mdUpload], AuthController.registerRestaurant);
api.post("/auth/registerDriver", [mdUpload], AuthController.registerDriver);
api.post("/auth/registerAdmin", [mdUpload], AuthController.registerAdmin);

// Ruta Genérica /auth/register (Para compatibilidad con formularios directos)
api.post("/auth/register", [mdUpload], AuthController.registerDriver);

// ======================================================
// RUTAS DE AUTENTICACIÓN (Login y Perfil)
// ======================================================
api.post("/auth/login", AuthController.login);
api.post("/users/login", AuthController.login);
api.post("/user/login", AuthController.login);

// Perfil de usuario (para validar token en el frontend)
api.get("/auth/me", [md_auth.asureAuth], AuthController.getMe);
api.get("/users/me", [md_auth.asureAuth], AuthController.getMe);

// Refresh Tokens
api.post("/auth/refreshAccessToken", AuthController.refreshAccessToken);
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);

module.exports = api;