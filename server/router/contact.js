const express = require("express");
const ContactController = require("../controllers/contact");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");

const api = express.Router();

// ==========================================
// 1. RUTA PÚBLICA (Enviar Formulario)
// ==========================================
api.post("/contact", ContactController.createContact);
api.post("/contacts", ContactController.createContact);

// ==========================================
// 2. RUTAS PRIVADAS (Gestión de Mensajes - Solo Admin)
// ==========================================

// Obtener la lista de mensajes
api.get("/contacts", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.getContacts);
api.get("/contact", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.getContacts);

// Actualizar el estado de un mensaje (Acepta /contacts/:id, /contact/:id y /contact/status/:id)
api.patch("/contacts/:id", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.updateContactStatus);
api.patch("/contact/:id", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.updateContactStatus);
api.patch("/contact/status/:id", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.updateContactStatus);

api.put("/contacts/:id", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.updateContactStatus);
api.put("/contact/:id", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.updateContactStatus);

// Eliminar mensaje de contacto
api.delete("/contacts/:id", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.deleteContact);
api.delete("/contact/:id", [mdAuth.asureAuth, mdRole.isAdmin], ContactController.deleteContact);

module.exports = api;