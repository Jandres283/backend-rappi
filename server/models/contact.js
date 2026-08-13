const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "El asunto es obligatorio"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "El mensaje es obligatorio"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_REVIEW", "RESOLVED"],
      default: "PENDING",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Opcional, si el mensaje lo envía un usuario autenticado
    },
    notes: {
      type: String,
      default: "", // Notas internas del administrador
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ status: 1, createdAt: -1 });

ContactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Contact", ContactSchema);