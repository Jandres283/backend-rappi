const User = require("../models/user");
const Client = require("../models/client");
const Restaurant = require("../models/restaurant");
const Driver = require("../models/driver");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

// ======================================================
// REGISTRO DE USUARIO (CON CREACIÓN DE SUBPERFIL)
// ======================================================
async function register(req, res) {
  const { firstName, lastName, email, password, phone, district, address, role } = req.body;

  if (!email) return res.status(400).json({ msg: "El email es obligatorio" });
  if (!password) return res.status(400).json({ msg: "La contraseña es obligatoria" });
  if (!firstName) return res.status(400).json({ msg: "El nombre es obligatorio" });

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      firstName,
      lastName: lastName || "",
      email: email.toLowerCase().trim(),
      password: hashPassword,
      phone: phone || "",
      district: district || "",
      address: address || "",
      role: role || "client",
      active: true,
      status: "active",
    });

    if (req.file) {
      user.avatar = `avatars/${req.file.filename}`;
    }

    const userStored = await user.save();
    const userRole = userStored.role.toLowerCase();

    if (userRole === "client") {
      const client = new Client({
        user: userStored._id,
        favoriteRestaurants: [],
        savedAddresses: userStored.address ? [{ address: userStored.address, district: userStored.district }] : []
      });
      await client.save();
    } else if (userRole === "restaurant") {
      const restaurant = new Restaurant({
        user: userStored._id,
        name: `${userStored.firstName}'s Restaurant`,
        address: userStored.address || "",
        district: userStored.district || "",
        phone: userStored.phone || ""
      });
      await restaurant.save();
    } else if (userRole === "delivery" || userRole === "driver") {
      const driver = new Driver({
        user: userStored._id,
        vehicleType: "bike",
        isAvailable: false
      });
      await driver.save();
    }

    return res.status(201).json({
      msg: "Usuario y subperfil registrados con éxito",
      user: userStored
    });

  } catch (error) {
    console.error("Error en el proceso de registro:", error);
    if (error.code === 11000) {
      return res.status(400).json({ msg: "El correo electrónico ya está registrado." });
    }
    return res.status(500).json({ msg: "Error del servidor al registrar el usuario.", error: error.message });
  }
}

// ======================================================
// LOGIN DE USUARIO
// ======================================================
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "El email y la contraseña son obligatorios" });
  }

  const emailClean = email.toLowerCase().trim();

  try {
    const userStore = await User.findOne({ email: emailClean });
    if (!userStore) {
      return res.status(404).json({ msg: "Usuario o contraseña incorrectos." });
    }

    const check = await bcrypt.compare(password, userStore.password);
    if (!check) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos." });
    }

    if (!userStore.active) {
      return res.status(403).json({ 
        msg: "Acceso no permitido. Tu cuenta está inactiva o pendiente de activación por un administrador." 
      });
    }

    const accessToken = jwt.createAccessToken(userStore);
    const refreshToken = jwt.createRefreshToken(userStore);

    return res.status(200).json({
      access: accessToken,
      refresh: refreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ msg: "Error del servidor al iniciar sesión" });
  }
}

// ======================================================
// OBTENER USUARIO AUTENTICADO
// ======================================================
async function getMe(req, res) {
  const { user_id } = req.user;

  try {
    const response = await User.findById(user_id).select("-password");
    if (!response) {
      return res.status(404).json({ msg: "No se ha encontrado el usuario" });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error del servidor" });
  }
}

// ======================================================
// OBTENER LISTA DE USUARIOS
// ======================================================
async function getUsers(req, res) {
  const { active, role, page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }
  };

  const query = {};
  if (active !== undefined && active !== "") query.active = active === "true";
  if (role && role.trim() !== "") query.role = role.trim();

  try {
    const users = await User.paginate(query, options);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: "Error al obtener usuarios" });
  }
}

// ======================================================
// OBTENER USUARIO POR ID
// ======================================================
async function getUser(req, res) {
  const { id } = req.params;

  try {
    const response = await User.findById(id).select("-password");
    if (!response) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error al obtener el usuario" });
  }
}

// ======================================================
// ACTUALIZAR USUARIO
// ======================================================
async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
  }

  if (req.file) {
    userData.avatar = `avatars/${req.file.filename}`;
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(id, userData, { new: true }).select("-password");
    if (!userUpdated) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.status(200).json({ msg: "Usuario actualizado correctamente", user: userUpdated });
  } catch (error) {
    return res.status(500).json({ msg: "Error al actualizar el usuario" });
  }
}

// ======================================================
// ACTIVAR / DESACTIVAR USUARIO
// ======================================================
async function setActive(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const userUpdated = await User.findByIdAndUpdate(id, { active }, { new: true }).select("-password");
    if (!userUpdated) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.status(200).json({ msg: "Estado del usuario actualizado", active: userUpdated.active });
  } catch (error) {
    return res.status(500).json({ msg: "Error al cambiar el estado del usuario" });
  }
}

// ======================================================
// ELIMINAR USUARIO
// ======================================================
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.status(200).json({ msg: "Usuario eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ msg: "Error al eliminar el usuario" });
  }
}

module.exports = {
  register,
  login,
  getMe,
  getUsers,
  getUser,
  updateUser,
  setActive,
  deleteUser
};