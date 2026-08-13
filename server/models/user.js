const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    phone: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    district: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "client", "restaurant", "delivery", "driver"],
      default: "client",
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema, "users");