const express = require("express");
const mongoose = require("mongoose");
const api = express.Router();

// 1. ESQUEMA Y MODELO DE MONGOOSE DIRECTO EN EL ROUTER
// (Si ya tienes un modelo en models/dish.js puedes hacer const Dish = require("../models/dish"))
const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: String,
    restaurant: { type: mongoose.Schema.Types.Mixed } // Guarda el ID o Referencia del restaurante
  },
  { timestamps: true }
);

// Evitamos sobreescribir el modelo si ya estaba compilado
const Dish = mongoose.models.Dish || mongoose.model("Dish", dishSchema);


// 2. RUTA OBTENER PLATILLOS (GET)
const getDishesHandler = async (req, res) => {
  try {
    const { restaurant } = req.query;
    let query = {};

    // Si viene un ID de restaurante en la URL (ej. ?restaurant=64f...)
    if (restaurant) {
      if (mongoose.Types.ObjectId.isValid(restaurant)) {
        query = {
          $or: [
            { restaurant: restaurant },
            { restaurant: new mongoose.Types.ObjectId(restaurant) }
          ]
        };
      } else {
        query = { restaurant: restaurant };
      }
    }

    // Buscamos en la base de datos real de Mongo
    let dishes = await Dish.find(query);

    // Fallback de desarrollo: si no halló nada filtrado por ID, trae todos los platos
    if (dishes.length === 0 && restaurant) {
      dishes = await Dish.find({});
    }

    return res.status(200).json(dishes);
  } catch (error) {
    console.error("Error al consultar platillos en MongoDB:", error);
    return res.status(500).json({ error: "Error interno al consultar MongoDB" });
  }
};

api.get("/dish", getDishesHandler);
api.get("/dishes", getDishesHandler);


// 3. RUTA CREAR PLATILLO (POST)
const createDishHandler = async (req, res) => {
  try {
    const { name, description, price, category, image, restaurant } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "El nombre y precio son obligatorios" });
    }

    const newDish = new Dish({
      name,
      description: description || "",
      price: parseFloat(price),
      category: category || "Pollo a la brasa",
      image: image || "",
      restaurant: restaurant || null
    });

    const savedDish = await newDish.save();
    return res.status(201).json(savedDish);
  } catch (error) {
    console.error("Error al guardar platillo en MongoDB:", error);
    return res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
};

api.post("/dish", createDishHandler);
api.post("/dishes", createDishHandler);


// 4. RUTA ELIMINAR PLATILLO (DELETE)
const deleteDishHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await Dish.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Platillo eliminado con éxito de MongoDB" });
  } catch (error) {
    console.error("Error al eliminar de MongoDB:", error);
    return res.status(500).json({ error: "Error al eliminar platillo" });
  }
};

api.delete("/dish/:id", deleteDishHandler);
api.delete("/dishes/:id", deleteDishHandler);

module.exports = api;