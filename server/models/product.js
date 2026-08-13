const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      lowercase: true,
    },
    miniature: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "restaurantModel",
      required: [true, "El producto debe estar asociado a un restaurante"],
    },
    restaurantModel: {
      type: String,
      enum: ["User", "Restaurant"],
      default: "Restaurant",
    },
  },
  {
    timestamps: true,
  }
);

// Índices para optimizar las consultas y filtros en la DB
ProductSchema.index({ restaurant: 1, active: 1 });
ProductSchema.index({ category: 1 });

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", ProductSchema);