const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "El producto es obligatorio"],
  },
  name: { type: String, required: true },
  quantity: {
    type: Number,
    required: [true, "La cantidad es obligatoria"],
    min: [1, "La cantidad mínima es 1"],
  },
  price: {
    type: Number,
    required: [true, "El precio unitario es obligatorio"],
    min: [0, "El precio no puede ser negativo"],
  },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La orden debe pertenecer a un usuario"],
    },
    customerName: {
      type: String,
      trim: true,
      default: "",
    },
    customerPhone: {
      type: String,
      trim: true,
      default: "",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "La orden debe estar asociada a un restaurante"],
    },
    deliveryDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    items: [OrderItemSchema],
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: [true, "El total de la orden es obligatorio"],
      min: 0,
    },
    address: {
      type: String,
      required: [true, "La dirección de entrega es obligatoria"],
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "TRANSFER", "YAPE", "PLIN", "YAPE_PLIN", "yape", "plin"],
      default: "CASH",
    },
    status: {
      type: String,
      enum: ["PENDING", "PREPARING", "READY", "IN_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ restaurant: 1, status: 1 });
OrderSchema.index({ deliveryDriver: 1, status: 1 });

OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", OrderSchema);