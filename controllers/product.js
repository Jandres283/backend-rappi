const mongoose = require("mongoose");
const Product = require("../models/product");
const Restaurant = require("../models/restaurant");
const imageUtil = require("../utils/image");

/**
 * Crear un nuevo producto
 */
async function createProduct(req, res) {
  try {
    const productData = { ...req.body };

    // 1. Convertir 'price' a número
    if (productData.price !== undefined) {
      productData.price = Number(productData.price);
    }

    // 2. Estado activo por defecto
    if (productData.active === undefined) {
      productData.active = true;
    }

    // 3. Procesar imagen
    const imageFile = req.files?.miniature || req.files?.image;
    if (imageFile) {
      const imagePath = imageUtil.getFilePath(imageFile);
      productData.miniature = imagePath;
      productData.image = imagePath;
    }

    // 4. Resolver ID del restaurante vinculante
    let targetRestaurantId = productData.restaurant || productData.restaurantId;

    if (!targetRestaurantId && req.user) {
      const userId = req.user._id || req.user.user_id || req.user.id;
      
      const userRestaurant = await Restaurant.findOne({ 
        $or: [{ user: userId }, { _id: userId }] 
      }).lean();

      if (userRestaurant) {
        targetRestaurantId = userRestaurant._id;
        productData.restaurantModel = "Restaurant";
      } else {
        targetRestaurantId = userId;
        productData.restaurantModel = "User";
      }
    }

    if (!targetRestaurantId || !mongoose.Types.ObjectId.isValid(targetRestaurantId)) {
      return res.status(400).send({
        msg: "El ID del restaurante enviado no es un ObjectId válido.",
        receivedId: targetRestaurantId,
      });
    }

    // Guardar como ObjectId
    productData.restaurant = new mongoose.Types.ObjectId(targetRestaurantId);

    if (!productData.restaurantModel) {
      productData.restaurantModel = "Restaurant";
    }

    // 5. Guardar producto
    const product = new Product(productData);
    const productStored = await product.save();

    return res.status(201).send(productStored);
  } catch (error) {
    console.error("Error de Mongoose al guardar producto:", error);
    return res.status(400).send({
      msg: error.message || "Error al crear el producto.",
      errors: error.errors || null,
    });
  }
}

/**
 * Obtener lista de productos (Búsqueda cruzada inteligente Restaurante <-> Usuario)
 */
async function getProducts(req, res) {
  try {
    const { page = 1, limit = 100, category, active, restaurant, search } = req.query;

    const filters = {};

    // Búsqueda por Categoría
    if (category && category !== "todos" && category !== "all") {
      filters.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    // Búsqueda por Estado Activo
    if (active === "true" || active === true) {
      filters.active = true;
    } else if (active === "false" || active === false) {
      filters.active = false;
    }

    // Búsqueda por Nombre
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    // 🎯 FILTRADO INTELIGENTE POR RESTAURANTE
    if (restaurant && restaurant !== "undefined" && restaurant !== "null") {
      const restIdStr = String(restaurant).trim();

      if (mongoose.Types.ObjectId.isValid(restIdStr)) {
        const restObjId = new mongoose.Types.ObjectId(restIdStr);
        
        // 1. Verificar si el ID pertenece al documento Restaurante
        const restDoc = await Restaurant.findById(restObjId).lean();
        
        const possibleIds = [restObjId, restIdStr];

        if (restDoc) {
          // Si existe el restaurante, agregamos también el ID del usuario propietario
          if (restDoc.user) {
            possibleIds.push(restDoc.user);
            if (mongoose.Types.ObjectId.isValid(restDoc.user)) {
              possibleIds.push(new mongoose.Types.ObjectId(restDoc.user));
            }
          }
        } else {
          // Si el ID era de un Usuario, buscamos su Restaurante asociado
          const userRestDoc = await Restaurant.findOne({ user: restObjId }).lean();
          if (userRestDoc) {
            possibleIds.push(userRestDoc._id);
            possibleIds.push(String(userRestDoc._id));
          }
        }

        // Realizar la búsqueda por cualquier coincidencia posible
        filters.$or = [
          { restaurant: { $in: possibleIds } },
          { restaurant_id: { $in: possibleIds } },
          { user: { $in: possibleIds } }
        ];
      } else {
        filters.restaurant = restIdStr;
      }
    }

    // Paginación
    if (Product.paginate) {
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: {
          path: "restaurant",
          select: "firstName lastName email avatar name category address image",
        },
      };

      const products = await Product.paginate(filters, options);
      return res.status(200).send(products);
    }

    // Búsqueda tradicional
    const products = await Product.find(filters)
      .populate("restaurant", "firstName lastName email avatar name category address image")
      .sort({ createdAt: -1 });

    return res.status(200).send(products);
  } catch (error) {
    console.error("Error en getProducts:", error);
    return res.status(500).send({ msg: "Error al obtener la lista de productos." });
  }
}

/**
 * Obtener producto por ID
 */
async function getProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ msg: "ID inválido." });
    }

    const response = await Product.findById(id).populate("restaurant");

    if (!response) {
      return res.status(404).send({ msg: "Producto no encontrado." });
    }

    return res.status(200).send(response);
  } catch (error) {
    console.error("Error en getProduct:", error);
    return res.status(500).send({ msg: "Error al obtener el producto." });
  }
}

/**
 * Actualizar producto
 */
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const productData = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ msg: "ID de producto inválido." });
    }

    if (productData.price !== undefined) {
      productData.price = Number(productData.price);
    }

    const imageFile = req.files?.miniature || req.files?.image;
    if (imageFile) {
      const imagePath = imageUtil.getFilePath(imageFile);
      productData.miniature = imagePath;
      productData.image = imagePath;
    }

    delete productData.restaurant;

    const productUpdated = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });

    if (!productUpdated) {
      return res.status(404).send({ msg: "Producto no encontrado." });
    }

    return res.status(200).send(productUpdated);
  } catch (error) {
    console.error("Error en updateProduct:", error);
    return res.status(400).send({ msg: error.message || "Error al actualizar el producto." });
  }
}

/**
 * Eliminar producto
 */
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ msg: "ID de producto inválido." });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const productDeleted = await Product.findByIdAndDelete(objectId);

    if (!productDeleted) {
      return res.status(404).send({ msg: "Producto no encontrado o ya eliminado." });
    }

    return res.status(200).send({ msg: "Producto eliminado correctamente.", id });
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    return res.status(500).send({ msg: "Error interno al eliminar el producto." });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};