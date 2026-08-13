const express = require("express");
const multiparty = require("connect-multiparty");
const ProductController = require("../controllers/product");
const mdAuth = require("../middlewares/authenticated");
const mdRole = require("../middlewares/isRole");

const mdUpload = multiparty({ uploadDir: "./uploads/product" });
const api = express.Router();

// RUTAS PÚBLICAS
api.get("/products", ProductController.getProducts);
api.get("/restaurants/:restaurantId/products", (req, res, next) => {
  req.query.restaurant = req.params.restaurantId;
  return ProductController.getProducts(req, res, next);
});
api.get("/product/:id", ProductController.getProduct);
api.get("/products/:id", ProductController.getProduct);

// RUTAS PROTEGIDAS
api.post("/product", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin, mdUpload], ProductController.createProduct);
api.post("/products", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin, mdUpload], ProductController.createProduct);

api.patch("/product/:id", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin, mdUpload], ProductController.updateProduct);
api.put("/product/:id", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin, mdUpload], ProductController.updateProduct);
api.patch("/products/:id", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin, mdUpload], ProductController.updateProduct);
api.put("/products/:id", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin, mdUpload], ProductController.updateProduct);

// ELIMINAR (Plural y Singular)
api.delete("/product/:id", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin], ProductController.deleteProduct);
api.delete("/products/:id", [mdAuth.asureAuth, mdRole.isRestaurantOrAdmin], ProductController.deleteProduct);

module.exports = api;