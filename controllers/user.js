const express = require("express");
const UserController = require("../controllers/user");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");
// 🔴 CORREGIDO: Cambiado 'upload' por 'multer'
const upload = require("../middlewares/multer"); 

// Middleware de Multer para la subida de un solo archivo con campo 'avatar'
const mdUpload = upload("avatars").single("avatar");

const api = express.Router();

// ======================================================
// RUTAS PÚBLICAS (Registro y Login)
// ======================================================
api.post("/user/register", mdUpload, UserController.register);
api.post("/users/register", mdUpload, UserController.register);

api.post("/user/login", UserController.login);
api.post("/users/login", UserController.login);

// ======================================================
// RUTAS PROTEGIDAS (Requieren Token)
// ======================================================
api.get("/user/me", [mdAuth.asureAuth], UserController.getMe);

api.get("/users", [mdAuth.asureAuth, mdRole.isAdmin], UserController.getUsers);
api.get("/user/:id", [mdAuth.asureAuth], UserController.getUser);
api.get("/users/:id", [mdAuth.asureAuth], UserController.getUser);

api.patch("/user/:id", [mdAuth.asureAuth, mdUpload], UserController.updateUser);
api.patch("/users/:id", [mdAuth.asureAuth, mdUpload], UserController.updateUser);

api.patch("/user/active/:id", [mdAuth.asureAuth, mdRole.isAdmin], UserController.setActive);

api.delete("/user/:id", [mdAuth.asureAuth, mdRole.isAdmin], UserController.deleteUser);
api.delete("/users/:id", [mdAuth.asureAuth, mdRole.isAdmin], UserController.deleteUser);

module.exports = api;