const Client = require("../models/client");
const Order = require("../models/order");

/**
 * Obtener o inicializar el perfil del cliente logueado
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.user_id;

    let client = await Client.findOne({ user: userId })
      .populate("user", "firstname lastname email phone avatar")
      .populate("favoriteRestaurants", "name image category rating")
      .populate("favoriteProducts", "name miniature price category");

    if (!client) {
      client = new Client({ user: userId, addresses: [] });
      await client.save();
      client = await client.populate("user", "firstname lastname email phone avatar");
    }

    return res.status(200).send(client);
  } catch (error) {
    console.error("Error en getProfile (Client):", error);
    return res.status(500).send({ msg: "Error al obtener el perfil de cliente." });
  }
}

/**
 * Agregar una nueva dirección de entrega
 */
async function addAddress(req, res) {
  try {
    const userId = req.user.user_id;
    const { title, address, reference, latitude, longitude, isDefault } = req.body;

    if (!address) {
      return res.status(400).send({ msg: "La dirección es obligatoria." });
    }

    let client = await Client.findOne({ user: userId });
    if (!client) {
      client = new Client({ user: userId, addresses: [] });
    }

    if (isDefault) {
      client.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const shouldBeDefault = isDefault || client.addresses.length === 0;

    client.addresses.push({
      title: title || "Casa",
      address,
      reference: reference || "",
      latitude: latitude || null,
      longitude: longitude || null,
      isDefault: shouldBeDefault,
    });

    await client.save();
    return res.status(201).send(client.addresses);
  } catch (error) {
    console.error("Error en addAddress:", error);
    return res.status(400).send({ msg: error.message || "Error al agregar la dirección." });
  }
}

/**
 * Establecer una dirección como predeterminada
 */
async function setDefaultAddress(req, res) {
  try {
    const userId = req.user.user_id;
    const { addressId } = req.params;

    const client = await Client.findOne({ user: userId });
    if (!client) {
      return res.status(404).send({ msg: "Perfil de cliente no encontrado." });
    }

    client.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await client.save();
    return res.status(200).send({ msg: "Dirección predeterminada actualizada.", addresses: client.addresses });
  } catch (error) {
    console.error("Error en setDefaultAddress:", error);
    return res.status(500).send({ msg: "Error al cambiar la dirección predeterminada." });
  }
}

/**
 * Eliminar una dirección de entrega por ID
 */
async function deleteAddress(req, res) {
  try {
    const userId = req.user.user_id;
    const { addressId } = req.params;

    const client = await Client.findOne({ user: userId });
    if (!client) {
      return res.status(404).send({ msg: "Perfil de cliente no encontrado." });
    }

    client.addresses = client.addresses.filter((addr) => addr._id.toString() !== addressId);
    await client.save();

    return res.status(200).send({ msg: "Dirección eliminada correctamente.", addresses: client.addresses });
  } catch (error) {
    console.error("Error en deleteAddress:", error);
    return res.status(500).send({ msg: "Error al eliminar la dirección." });
  }
}

/**
 * Actualizar método de pago preferido (Convierte a Mayúsculas automáticamente)
 */
async function updatePaymentMethod(req, res) {
  try {
    const userId = req.user.user_id;
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).send({ msg: "El método de pago es requerido." });
    }

    let client = await Client.findOne({ user: userId });
    if (!client) {
      client = new Client({ user: userId });
    }

    // Convierte "card", "yape", etc. a "CARD", "YAPE" para cumplir el enum del Schema
    client.defaultPaymentMethod = paymentMethod.toUpperCase();
    await client.save();

    return res.status(200).send({
      msg: "Método de pago preferido actualizado.",
      defaultPaymentMethod: client.defaultPaymentMethod,
    });
  } catch (error) {
    console.error("Error en updatePaymentMethod:", error);
    return res.status(500).send({ msg: "Error al actualizar método de pago. Asegúrate de enviar un valor válido." });
  }
}

/**
 * Agregar o quitar un restaurante de Favoritos (Toggle)
 */
async function toggleFavoriteRestaurant(req, res) {
  try {
    const userId = req.user.user_id;
    const { restaurantId } = req.body;

    let client = await Client.findOne({ user: userId });
    if (!client) {
      client = new Client({ user: userId });
    }

    const index = client.favoriteRestaurants.indexOf(restaurantId);

    if (index === -1) {
      client.favoriteRestaurants.push(restaurantId);
    } else {
      client.favoriteRestaurants.splice(index, 1);
    }

    await client.save();
    return res.status(200).send({
      msg: index === -1 ? "Añadido a favoritos" : "Eliminado de favoritos",
      favorites: client.favoriteRestaurants,
    });
  } catch (error) {
    console.error("Error en toggleFavoriteRestaurant:", error);
    return res.status(500).send({ msg: "Error al gestionar restaurantes favoritos." });
  }
}

/**
 * Agregar o quitar un producto de Favoritos (Toggle)
 */
async function toggleFavoriteProduct(req, res) {
  try {
    const userId = req.user.user_id;
    const { productId } = req.body;

    let client = await Client.findOne({ user: userId });
    if (!client) {
      client = new Client({ user: userId });
    }

    const index = client.favoriteProducts.indexOf(productId);

    if (index === -1) {
      client.favoriteProducts.push(productId);
    } else {
      client.favoriteProducts.splice(index, 1);
    }

    await client.save();
    return res.status(200).send({
      msg: index === -1 ? "Producto añadido a favoritos" : "Producto eliminado de favoritos",
      favorites: client.favoriteProducts,
    });
  } catch (error) {
    console.error("Error en toggleFavoriteProduct:", error);
    return res.status(500).send({ msg: "Error al gestionar productos favoritos." });
  }
}

/**
 * Obtener el historial de pedidos del cliente autenticado
 */
async function getMyOrders(req, res) {
  try {
    const userId = req.user.user_id;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: [
        { path: "restaurant", select: "name image address" },
        { path: "deliveryDriver", select: "firstname lastname phone" },
      ],
    };

    const orders = await Order.paginate({ user: userId }, options);
    return res.status(200).send(orders);
  } catch (error) {
    console.error("Error en getMyOrders:", error);
    return res.status(500).send({ msg: "Error al obtener el historial de pedidos." });
  }
}

module.exports = {
  getProfile,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  updatePaymentMethod,
  toggleFavoriteRestaurant,
  toggleFavoriteProduct,
  getMyOrders,
};