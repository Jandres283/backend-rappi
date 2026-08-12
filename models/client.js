const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título de la dirección es obligatorio"],
    trim: true,
    default: "Mi Dirección",
  },
  address: {
    type: String,
    required: [true, "La dirección exacta es obligatoria"],
    trim: true,
  },
  reference: {
    type: String,
    trim: true,
    default: "",
  },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const ClientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El perfil de cliente debe estar vinculado a un usuario"],
      unique: true,
    },
    addresses: [AddressSchema],
    favoriteRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
    favoriteProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    defaultPaymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "TRANSFER", "YAPE", "PLIN"],
      default: "CASH",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", ClientSchema);