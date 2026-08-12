const express = require("express");
const UserController = require("../controllers/user");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");
const upload = require("../middlewares/multer");

const authMiddleware = mdAuth.asureAuth || mdAuth.ensureAuth;
const adminMiddleware = mdRole.isAdmin || mdRole.checkRole || mdRole;

let mdUpload = (req, res, next) => next();
if (typeof upload === "function") {
  const u = upload("avatars");
  if (u && typeof u.single === "function") {
    mdUpload = u.single("avatar");
  }
}

const api = express.Router();

api.post("/user/register", mdUpload, UserController.register);
api.post("/users/register", mdUpload, UserController.register);

api.post("/user/login", UserController.login);
api.post("/users/login", UserController.login);

api.get("/user/me", [authMiddleware], UserController.getMe);

api.get("/users", [authMiddleware, adminMiddleware], UserController.getUsers);
api.get("/user/:id", [authMiddleware], UserController.getUser);
api.get("/users/:id", [authMiddleware], UserController.getUser);

api.patch("/user/:id", [authMiddleware, mdUpload], UserController.updateUser);
api.patch("/users/:id", [authMiddleware, mdUpload], UserController.updateUser);

api.patch("/user/active/:id", [authMiddleware, adminMiddleware], UserController.setActive);

api.delete("/user/:id", [authMiddleware, adminMiddleware], UserController.deleteUser);
api.delete("/users/:id", [authMiddleware, adminMiddleware], UserController.deleteUser);

module.exports = api;
