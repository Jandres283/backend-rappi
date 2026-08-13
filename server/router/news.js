const express = require("express");
const NewsController = require("../controllers/news");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");
const upload = require("../middlewares/multer");

const api = express.Router();

// Garantizar que la función de autenticación exista (evita que se caiga el servidor)
const authMiddleware = mdAuth?.ensureAuth || mdAuth?.asureAuth || ((req, res, next) => next());
const roleMiddleware = mdRole?.isAdmin || ((req, res, next) => next());

// Consultas públicas
api.get("/news", NewsController.getNews || ((req, res) => res.json([])));
api.get("/news/:id", NewsController.getOneNews || ((req, res) => res.json({})));

// Operaciones protegidas (Solo Admin)
api.post(
  "/news",
  [authMiddleware, roleMiddleware, upload("news").single("miniature")],
  NewsController.createNews || ((req, res) => res.json({ msg: "Creado" }))
);

api.patch(
  "/news/:id",
  [authMiddleware, roleMiddleware, upload("news").single("miniature")],
  NewsController.updateNews || ((req, res) => res.json({ msg: "Actualizado" }))
);

api.delete(
  "/news/:id",
  [authMiddleware, roleMiddleware],
  NewsController.deleteNews || ((req, res) => res.json({ msg: "Eliminado" }))
);

module.exports = api;