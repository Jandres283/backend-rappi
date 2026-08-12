const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del restaurante es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: null,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "El costo de envío no puede ser negativo"],
    },
    estimatedTime: {
      type: String,
      default: "30-40 min",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El restaurante debe estar vinculado a un usuario propietario"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

RestaurantSchema.index({ category: 1, active: 1 });
RestaurantSchema.index({ user: 1 });

RestaurantSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Restaurant", RestaurantSchema);