const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const DriverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El repartidor debe estar vinculado a un usuario"],
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ["MOTORCYCLE", "BICYCLE", "CAR", "WALKING"],
      default: "MOTORCYCLE",
    },
    vehiclePlate: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: false, // El repartidor se pone en "línea" manualmente desde la App
    },
    currentLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      updatedAt: { type: Date, default: Date.now },
    },
    activeOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

DriverSchema.index({ isAvailable: 1 });
DriverSchema.index({ "currentLocation.latitude": 1, "currentLocation.longitude": 1 });

DriverSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Driver", DriverSchema);