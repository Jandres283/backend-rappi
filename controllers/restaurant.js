const Restaurant = require("../models/restaurant");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const mongoose = require("mongoose");
const { getFilePath } = require("../utils/image");

/**
 * 1. REGISTRO PÚBLICO DE NUEVO RESTAURANTE
 */
async function registerRestaurant(req, res) {
  try {
    const {
      firstName,
      firstname,
      lastName,
      lastname,
      email,
      password,
      name,
      address,
      phone,
      telephone,
      category,
    } = req.body;

    const ownerFirstName = firstName || firstname || "Propietario";
    const ownerLastName = lastName || lastname || "";
    const userPhone = phone || telephone;

    if (!email || !password || !name || !userPhone) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: "error",
        msg: "Faltan datos obligatorios (email, contraseña, nombre o teléfono).",
      });
    }

    const emailClean = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: "error",
        msg: "El correo electrónico ya se encuentra registrado.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName: ownerFirstName,
      lastName: ownerLastName,
      email: emailClean,
      phone: userPhone,
      password: hashPassword,
      role: "restaurant",
      active: true,
    });

    const userStored = await newUser.save();

    const restaurantData = {
      name,
      address: address || "",
      phone: userPhone,
      category: category ? String(category).toLowerCase().trim() : "general",
      user: userStored._id,
    };

    if (req.file) {
      restaurantData.image = getFilePath(req.file);
    }

    const restaurant = new Restaurant(restaurantData);
    const restaurantStored = await restaurant.save();

    return res.status(201).json({
      status: "success",
      msg: "Restaurante y cuenta registrados exitosamente.",
      user: userStored,
      restaurant: restaurantStored,
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        /* Ignorar error al limpiar archivo */
      }
    }
    console.error("Error en registerRestaurant:", error);
    return res.status(400).json({
      status: "error",
      msg: error.message || "Error al procesar el registro del restaurante.",
    });
  }
}

/**
 * 2. CREAR UN RESTAURANTE (Ruta protegida)
 */
async function createRestaurant(req, res) {
  try {
    const restaurantData = { ...req.body };

    if (req.file) {
      restaurantData.image = getFilePath(req.file);
    }

    const userId =
      req.user?._id ||
      req.user?.user_id ||
      req.user?.id ||
      req.user?.sub;

    if (!restaurantData.user && userId) {
      restaurantData.user = userId;
    }

    const restaurant = new Restaurant(restaurantData);
    const restaurantStored = await restaurant.save();

    return res.status(201).json(restaurantStored);
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        /* Ignorar error al limpiar archivo */
      }
    }
    console.error("Error en createRestaurant:", error);
    return res.status(400).json({
      status: "error",
      msg: error.message || "Error al crear el restaurante.",
    });
  }
}

/**
 * 3. OBTENER RESTAURANTE DEL USUARIO AUTENTICADO (/restaurant/me)
 * 🛡️ Anti-Crash 500: Responde con 401 o 404 limpio si hay problemas.
 */
async function getMe(req, res) {
  try {
    // Extraer ID de usuario del token normalizado o crudo
    const rawUserId =
      req.user?._id ||
      req.user?.user_id ||
      req.user?.id ||
      req.user?.sub ||
      (typeof req.user === "string" ? req.user : null);

    if (!rawUserId || rawUserId === "undefined" || rawUserId === "null") {
      return res.status(401).json({
        status: "error",
        msg: "No se identificó el ID de usuario dentro del token enviado.",
      });
    }

    const userIdStr = String(rawUserId).trim();

    // Filtro flexible
    let filter = { user: userIdStr };

    if (mongoose.Types.ObjectId.isValid(userIdStr)) {
      filter = {
        $or: [
          { user: userIdStr },
          { user: new mongoose.Types.ObjectId(userIdStr) },
        ],
      };
    }

    let restaurant = await Restaurant.findOne(filter).lean();

    if (!restaurant) {
      return res.status(404).json({
        status: "error",
        msg: "No se encontró ningún restaurante asociado a esta cuenta.",
      });
    }

    // Populate de usuario seguro sin romper el flujo si el modelo User falla
    if (restaurant.user) {
      try {
        const userDoc = await User.findById(restaurant.user)
          .select("firstName lastName email phone avatar image photo")
          .lean();
        if (userDoc) restaurant.user = userDoc;
      } catch (popErr) {
        console.warn("Aviso: No se pudo popular el usuario en getMe:", popErr.message);
      }
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    console.error("🔥 Error capturado en getMe:", error);
    return res.status(400).json({
      status: "error",
      msg: "No se pudo consultar el restaurante del usuario.",
      details: error.message,
    });
  }
}

/**
 * 4. OBTENER LISTA DE RESTAURANTES (Paginado / Filtrado)
 */
async function getRestaurants(req, res) {
  try {
    const { page = 1, limit = 10, category, isOpen, active, user } = req.query;

    const filters = {};

    if (user && user !== "undefined" && mongoose.Types.ObjectId.isValid(user)) {
      filters.user = new mongoose.Types.ObjectId(user);
    } else if (user && user !== "undefined") {
      filters.user = user;
    }

    if (category && category !== "todos") {
      filters.category = String(category).toLowerCase().trim();
    }
    if (isOpen !== undefined) filters.isOpen = isOpen === "true";
    if (active !== undefined) filters.active = active === "true";

    // Paginación con mongoose-paginate-v2 si está configurado en el Schema
    if (Restaurant.paginate) {
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: {
          path: "user",
          select: "firstName lastName email phone avatar image photo",
        },
      };

      const restaurants = await Restaurant.paginate(filters, options);
      return res.status(200).json(restaurants);
    }

    // Consulta estándar si no hay plugin de paginación
    const restaurants = await Restaurant.find(filters)
      .populate("user", "firstName lastName email phone avatar image photo")
      .sort({ createdAt: -1 });

    return res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error en getRestaurants:", error);
    return res.status(400).json({
      status: "error",
      msg: "Error al consultar la lista de restaurantes.",
      details: error.message,
    });
  }
}

/**
 * 5. OBTENER UN RESTAURANTE POR ID
 */
async function getRestaurant(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        msg: "El ID proporcionado no es un formato válido de MongoDB.",
      });
    }

    const response = await Restaurant.findById(id).populate(
      "user",
      "firstName lastName email phone avatar image photo"
    );

    if (!response) {
      return res.status(404).json({
        status: "error",
        msg: "Restaurante no encontrado.",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error en getRestaurant:", error);
    return res.status(400).json({
      status: "error",
      msg: "Error al obtener la información del restaurante.",
    });
  }
}

/**
 * 6. ACTUALIZAR RESTAURANTE POR ID
 */
async function updateRestaurant(req, res) {
  try {
    const { id } = req.params;
    const restaurantData = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: "error",
        msg: "El ID proporcionado no es un ObjectId válido.",
      });
    }

    if (req.file) {
      restaurantData.image = getFilePath(req.file);
    }

    const restaurantUpdated = await Restaurant.findByIdAndUpdate(
      id,
      restaurantData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurantUpdated) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          /* Ignorar error de limpieza */
        }
      }
      return res.status(404).json({
        status: "error",
        msg: "Restaurante no encontrado para actualizar.",
      });
    }

    return res.status(200).json(restaurantUpdated);
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        /* Ignorar error de limpieza */
      }
    }
    console.error("Error en updateRestaurant:", error);
    return res.status(400).json({
      status: "error",
      msg: error.message || "Error al actualizar el restaurante.",
    });
  }
}

/**
 * 7. ELIMINAR RESTAURANTE POR ID
 */
async function deleteRestaurant(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        msg: "El ID proporcionado no es un ObjectId válido.",
      });
    }

    const restaurantDeleted = await Restaurant.findByIdAndDelete(id);

    if (!restaurantDeleted) {
      return res.status(404).json({
        status: "error",
        msg: "Restaurante no encontrado para eliminar.",
      });
    }

    return res.status(200).json({
      status: "success",
      msg: "Restaurante eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error en deleteRestaurant:", error);
    return res.status(400).json({
      status: "error",
      msg: "Error al eliminar el restaurante.",
    });
  }
}

module.exports = {
  registerRestaurant,
  createRestaurant,
  getMe,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
};