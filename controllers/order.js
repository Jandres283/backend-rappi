const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

const populateOrderDetails = [
  { 
    path: "user", 
    select: "name firstName lastName email phone avatar role" 
  },
  { 
    path: "restaurant", 
    select: "name address phone image logo" 
  },
  { 
    path: "deliveryDriver", 
    select: "name firstName lastName phone" 
  },
];

async function createOrder(req, res) {
  try {
    const { 
      restaurant, 
      items, 
      address, 
      paymentMethod, 
      notes, 
      deliveryFee = 0, 
      customerName,
      customerPhone,
      phone
    } = req.body;

    // 🟢 1. OBTENER ID Y ROL DEL USUARIO AUTENTICADO
    const userId = req.user?.user_id || req.user?._id || req.user?.id;
    const userRole = (req.user?.role || "").toUpperCase();

    if (!userId) {
      return res.status(401).json({ msg: "No se pudo identificar al cliente. Debe iniciar sesión." });
    }

    // 🟢 2. BLOQUEO DE SEGURIDAD: Evita que el dueño/restaurante cree órdenes con su propio Token
    if (userRole === "RESTAURANT" || userRole === "ADMIN") {
      return res.status(403).json({ 
        msg: "Estás autenticado como Restaurante o Administrador. Inicia sesión con una cuenta de Cliente para realizar un pedido." 
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "La orden debe contener al menos un producto." });
    }

    const productIds = items.map((i) => i.product);
    const productsDb = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(productsDb.map((p) => [p._id.toString(), p]));

    let calculatedTotal = 0;
    const processedItems = [];

    for (const item of items) {
      const productDb = productMap.get(String(item.product));
      if (!productDb) {
        return res.status(404).json({ msg: `Producto no encontrado (ID: ${item.product})` });
      }

      const itemTotal = productDb.price * item.quantity;
      calculatedTotal += itemTotal;

      processedItems.push({
        product: productDb._id,
        name: productDb.name,
        quantity: item.quantity,
        price: productDb.price,
      });
    }

    const grandTotal = calculatedTotal + Number(deliveryFee);
    const clientPhone = customerPhone || phone || req.user?.phone || "";

    // 🟢 3. OBTENER NOMBRE REAL DEL CLIENTE
    const realClientName = 
      customerName || 
      `${req.user?.firstName || ""} ${req.user?.lastName || ""}`.trim() || 
      req.user?.name || 
      "Cliente";

    // Actualiza el teléfono del usuario si es un Cliente
    if (userId && clientPhone && userRole === "CLIENT") {
      await User.findByIdAndUpdate(userId, { phone: clientPhone }).catch(() => {});
    }

    const order = new Order({
      user: userId, // 👈 Guarda ID del cliente comprador
      customerName: realClientName,
      customerPhone: clientPhone,
      restaurant,
      items: processedItems,
      deliveryFee,
      total: grandTotal,
      address,
      paymentMethod,
      notes,
      status: "PENDING",
    });

    let orderStored = await order.save();
    orderStored = await Order.findById(orderStored._id).populate(populateOrderDetails);

    const io = req.app.get("io");
    if (io) {
      io.emit("new_order", orderStored);
      io.emit("order_updated", orderStored);
    }

    return res.status(201).json(orderStored);
  } catch (error) {
    console.error("Error en createOrder:", error);
    return res.status(400).json({ msg: error.message || "Error al crear la orden." });
  }
}

async function getOrders(req, res) {
  try {
    const { page = 1, limit = 100, status, restaurant } = req.query;
    const userId = req.user?.user_id || req.user?._id || req.user?.id;
    const userRole = (req.user?.role || "").toUpperCase();

    const filters = {};

    if (userRole === "CLIENT") {
      filters.user = userId;
    } else if (userRole === "DRIVER" || userRole === "DELIVERY") {
      if (status === "DELIVERED" || status === "ENTREGADO") {
        filters.deliveryDriver = userId;
        filters.status = { $in: ["DELIVERED", "COMPLETED", "ENTREGADO"] };
      } else {
        // 🎯 CORRECCIÓN: El driver solo ve pedidos sin asignar en estado "READY" o "LISTO",
        // o pedidos que él mismo ya tenga asignados.
        filters.$or = [
          { deliveryDriver: userId },
          { status: { $in: ["READY", "LISTO"] }, deliveryDriver: null },
        ];
      }
    } else if (userRole === "RESTAURANT" || restaurant) {
      if (restaurant) filters.restaurant = restaurant;
    }

    if (status && status !== "ALL" && !filters.status) {
      filters.status = status;
    }

    const options = {
      page: Math.max(1, parseInt(page, 10) || 1),
      limit: Math.max(1, parseInt(limit, 10) || 100),
      sort: { createdAt: -1 },
      populate: populateOrderDetails,
    };

    const orders = await Order.paginate(filters, options);
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error en getOrders:", error);
    return res.status(500).json({ msg: "Error al obtener las órdenes." });
  }
}

async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate(populateOrderDetails);

    if (!order) {
      return res.status(404).json({ msg: "Orden no encontrada." });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error en getOrder:", error);
    return res.status(500).json({ msg: "Error al obtener la orden." });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, deliveryDriver, address, notes, paymentMethod, total, deliveryFee, customerName, customerPhone } = req.body;

    const userRole = (req.user?.role || "").toUpperCase();
    const currentUserId = req.user?.user_id || req.user?._id || req.user?.id;

    const isDriverTakeover =
      (status === "IN_DELIVERY" || status === "DELIVERED" || status === "EN_CAMINO") &&
      (userRole === "DRIVER" || userRole === "DELIVERY");

    const queryFilter = { _id: id };
    const updateData = {};

    if (status) updateData.status = status;
    if (deliveryDriver !== undefined) updateData.deliveryDriver = deliveryDriver;
    if (address !== undefined) updateData.address = address;
    if (notes !== undefined) updateData.notes = notes;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (total !== undefined) updateData.total = Number(total);
    if (deliveryFee !== undefined) updateData.deliveryFee = Number(deliveryFee);
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;

    if (isDriverTakeover) {
      queryFilter.$or = [
        { deliveryDriver: null }, 
        { deliveryDriver: currentUserId }, 
        { deliveryDriver: { $exists: false } }
      ];
      updateData.deliveryDriver = currentUserId;
    }

    const orderUpdated = await Order.findOneAndUpdate(queryFilter, updateData, {
      new: true,
      runValidators: true,
    }).populate(populateOrderDetails);

    if (!orderUpdated) {
      return res.status(400).json({ msg: "No se pudo actualizar la orden." });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("order_updated", orderUpdated);
    }

    return res.status(200).json(orderUpdated);
  } catch (error) {
    console.error("Error en updateOrderStatus:", error);
    return res.status(400).json({ msg: error.message || "Error al actualizar la orden." });
  }
}

async function getClientOrderHistory(req, res) {
  try {
    const { clientId } = req.params;

    const orders = await Order.find({ user: clientId })
      .populate(populateOrderDetails)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      totalOrders: orders.length,
      history: orders,
    });
  } catch (error) {
    console.error("Error en getClientOrderHistory:", error);
    return res.status(500).json({ msg: "Error al obtener el historial." });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getClientOrderHistory,
};