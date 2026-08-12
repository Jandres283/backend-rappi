const Driver = require("../models/driver");
const Order = require("../models/order");

/**
 * Registrar o actualizar perfil de repartidor
 */
async function upsertDriverProfile(req, res) {
  try {
    const userId = req.user?.user_id || req.user?._id || req.user?.id;
    const { vehicleType, vehiclePlate, licenseNumber } = req.body;

    const driverProfile = await Driver.findOneAndUpdate(
      { user: userId },
      { vehicleType, vehiclePlate, licenseNumber },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json(driverProfile);
  } catch (error) {
    console.error("Error en upsertDriverProfile:", error);
    return res.status(400).json({ msg: error.message || "Error al actualizar perfil de repartidor." });
  }
}

/**
 * Alternar estado de disponibilidad (On/Off Line)
 */
async function toggleAvailability(req, res) {
  try {
    const userId = req.user?.user_id || req.user?._id || req.user?.id;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({ msg: "El campo 'isAvailable' debe ser un valor booleano." });
    }

    const driver = await Driver.findOneAndUpdate(
      { user: userId },
      { isAvailable },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ msg: "Perfil de repartidor no encontrado." });
    }

    return res.status(200).json({
      msg: `Repartidor ${driver.isAvailable ? "disponible (en línea)" : "no disponible (fuera de línea)"}.`,
      isAvailable: driver.isAvailable,
    });
  } catch (error) {
    console.error("Error en toggleAvailability:", error);
    return res.status(500).json({ msg: "Error al cambiar disponibilidad." });
  }
}

/**
 * Actualizar ubicación GPS del repartidor
 */
async function updateLocation(req, res) {
  try {
    const userId = req.user?.user_id || req.user?._id || req.user?.id;
    const { latitude, longitude, lat, lng } = req.body;

    const finalLat = latitude ?? lat;
    const finalLng = longitude ?? lng;

    if (finalLat === undefined || finalLng === undefined) {
      return res.status(400).json({ msg: "Las coordenadas (latitude y longitude) son obligatorias." });
    }

    const driver = await Driver.findOneAndUpdate(
      { user: userId },
      {
        currentLocation: {
          latitude: Number(finalLat),
          longitude: Number(finalLng),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ msg: "Perfil de repartidor no encontrado." });
    }

    return res.status(200).json({ msg: "Ubicación actualizada correctamente.", location: driver.currentLocation });
  } catch (error) {
    console.error("Error en updateLocation:", error);
    return res.status(500).json({ msg: "Error al actualizar la ubicación GPS." });
  }
}

/**
 * GET /driver/orders/available - Obtener pedidos disponibles
 */
async function getAvailableOrders(req, res) {
  try {
    const orders = await Order.find({
      $or: [{ status: "READY" }, { status: "PENDING" }, { status: "PREPARING" }],
      $or: [{ deliveryDriver: null }, { deliveryDriver: { $exists: false } }],
    })
      .populate("restaurant", "name address phone")
      .populate("user", "firstName lastName phone")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders || []);
  } catch (error) {
    console.error("Error en getAvailableOrders:", error);
    return res.status(500).json({ msg: "Error al obtener pedidos disponibles." });
  }
}

/**
 * GET /driver/orders/active - Obtener la orden activa
 */
async function getActiveOrder(req, res) {
  try {
    const userId = req.user?.user_id || req.user?._id || req.user?.id;

    const activeOrder = await Order.findOne({
      deliveryDriver: userId,
      status: { $in: ["IN_DELIVERY", "IN_TRANSIT", "EN_CAMINO", "ACCEPTED", "ON_THE_WAY"] },
    })
      .populate("user", "firstName lastName phone email")
      .populate("restaurant", "name address phone");

    return res.status(200).json(activeOrder || null);
  } catch (error) {
    console.error("Error en getActiveOrder:", error);
    return res.status(500).json({ msg: "Error al obtener la orden activa." });
  }
}

/**
 * PATCH /driver/orders/:id/accept - Aceptar/Tomar una orden
 */
async function acceptOrder(req, res) {
  try {
    const userId = req.user?.user_id || req.user?._id || req.user?.id;
    const orderId = req.params.orderId || req.params.id;

    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ msg: "Perfil de repartidor no encontrado." });
    }

    if (driver.activeOrder) {
      return res.status(400).json({ msg: "Ya tienes una orden activa en proceso." });
    }

    const orderUpdated = await Order.findOneAndUpdate(
      { _id: orderId, $or: [{ deliveryDriver: null }, { deliveryDriver: { $exists: false } }] },
      { status: "IN_DELIVERY", deliveryDriver: userId },
      { new: true }
    ).populate([
      { path: "user", select: "firstName lastName email phone" },
      { path: "restaurant", select: "name address phone" },
      { path: "deliveryDriver", select: "firstName lastName phone" },
    ]);

    if (!orderUpdated) {
      return res.status(400).json({ msg: "La orden ya fue tomada por otro repartidor o no está disponible." });
    }

    driver.activeOrder = orderUpdated._id;
    driver.isAvailable = false;
    await driver.save();

    // ⚡ WEBSOCKET: Notificar cambio de estado
    const io = req.app.get("io");
    if (io) {
      io.emit("order_updated", orderUpdated);
    }

    return res.status(200).json({ msg: "Orden asignada correctamente.", order: orderUpdated });
  } catch (error) {
    console.error("Error en acceptOrder:", error);
    return res.status(500).json({ msg: "Error al aceptar la orden." });
  }
}

/**
 * PATCH /driver/orders/:id/complete - Finalizar entrega
 */
async function completeOrder(req, res) {
  try {
    const userId = req.user?.user_id || req.user?._id || req.user?.id;
    const orderId = req.params.id || req.params.orderId;

    // 1. Garantizar que la orden cambie a DELIVERED MANTENIENDO el deliveryDriver asociado
    const orderUpdated = await Order.findOneAndUpdate(
      { _id: orderId },
      { status: "DELIVERED", deliveryDriver: userId },
      { new: true }
    ).populate([
      { path: "user", select: "firstName lastName email phone" },
      { path: "restaurant", select: "name address phone" },
      { path: "deliveryDriver", select: "firstName lastName phone" },
    ]);

    if (!orderUpdated) {
      return res.status(404).json({ msg: "Orden no encontrada." });
    }

    // 2. Liberar al repartidor
    await Driver.findOneAndUpdate(
      { user: userId },
      { activeOrder: null, isAvailable: true }
    );

    // 3. ⚡ NOTIFICAR EN TIEMPO REAL VÍA WEBSOCKET
    const io = req.app.get("io");
    if (io) {
      io.emit("order_updated", orderUpdated);
    }

    return res.status(200).json({ msg: "¡Entrega completada exitosamente!", order: orderUpdated });
  } catch (error) {
    console.error("Error en completeOrder:", error);
    return res.status(500).json({ msg: "Error al completar la entrega." });
  }
}

/**
 * Obtener lista de repartidores (Vista Admin)
 */
async function getDrivers(req, res) {
  try {
    const { page = 1, limit = 10, isAvailable } = req.query;
    const filters = {};

    if (isAvailable !== undefined) filters.isAvailable = isAvailable === "true";

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: [
        { path: "user", select: "firstName lastName email phone avatar" },
        { path: "activeOrder" },
      ],
    };

    const drivers = await Driver.paginate(filters, options);
    return res.status(200).json(drivers);
  } catch (error) {
    console.error("Error en getDrivers:", error);
    return res.status(500).json({ msg: "Error al obtener repartidores." });
  }
}

module.exports = {
  upsertDriverProfile,
  toggleAvailability,
  updateLocation,
  getAvailableOrders,
  getActiveOrder,
  acceptOrder,
  completeOrder,
  getDrivers,
};