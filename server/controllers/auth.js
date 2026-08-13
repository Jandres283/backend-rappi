const User = require("../models/user");
const Client = require("../models/client");
const Restaurant = require("../models/restaurant");
const Driver = require("../models/driver");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const imageUtil = require("../utils/image");

// 1. POST /auth/registerClient
async function registerClient(req, res) {
  try {
    const { firstName, firstname, lastName, lastname, email, password, phone, address, district, avatar } = req.body;
    const fName = firstName || firstname;
    const lName = lastName || lastname || "";

    if (!email || !password || !fName || !phone) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({
        msg: "Los campos de nombre, email, contraseña y teléfono son obligatorios.",
      });
    }

    const emailClean = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailClean });

    if (existingUser) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({ msg: "El correo electrónico ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let avatarPath = avatar || null;
    if (req.files && req.files.avatar) {
      avatarPath = imageUtil.getFilePath(req.files.avatar);
    }

    const user = new User({
      firstName: fName,
      lastName: lName,
      email: emailClean,
      password: hashPassword,
      phone,
      address: address || "",
      district: district || "",
      avatar: avatarPath,
      role: "client",
      active: true,
      status: "active",
    });

    const userStored = await user.save();

    const initialAddresses = [];
    if (address) {
      initialAddresses.push({
        title: "Principal",
        address: district ? `${address}, ${district}` : address,
        isDefault: true,
      });
    }

    const client = new Client({
      user: userStored._id,
      addresses: initialAddresses,
    });

    const clientStored = await client.save();

    return res.status(201).send({
      msg: "Cliente registrado exitosamente. Por favor, inicia sesión.",
      _id: userStored._id,
      firstName: userStored.firstName,
      lastName: userStored.lastName,
      email: userStored.email,
      phone: userStored.phone,
      address: userStored.address,
      district: userStored.district,
      avatar: userStored.avatar,
      role: userStored.role,
      active: userStored.active,
      clientId: clientStored._id,
      addresses: clientStored.addresses,
    });
  } catch (error) {
    if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
    console.error("Error en registerClient:", error);
    return res.status(500).send({ msg: "Error al registrar el cliente.", error: error.message });
  }
}

// 2. POST /auth/registerRestaurant (SE MANTIENE ACTIVE: FALSE PARA APROBACIÓN DEL ADMIN)
async function registerRestaurant(req, res) {
  try {
    const { name, firstName, firstname, email, password, phone, address, district, category, avatar } = req.body;
    const restaurantName = name || firstName || firstname;

    if (!email || !password || !restaurantName || !phone) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({ msg: "Campos requeridos incompletos." });
    }

    const emailClean = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailClean });

    if (existingUser) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({ msg: "El correo electrónico ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let avatarPath = avatar || null;
    if (req.files && req.files.avatar) {
      avatarPath = imageUtil.getFilePath(req.files.avatar);
    }

    const user = new User({
      firstName: restaurantName,
      lastName: "Restaurante",
      email: emailClean,
      password: hashPassword,
      phone: phone,
      address: address || "",
      district: district || "",
      role: "restaurant",
      active: false, // 👈 Se mantiene requiring aprobación
      avatar: avatarPath,
    });

    const userStored = await user.save();

    const restaurant = new Restaurant({
      user: userStored._id,
      name: restaurantName,
      phone,
      address: address || "",
      district: district || "",
      category: category || "",
      image: avatarPath,
    });

    const restaurantStored = await restaurant.save();

    return res.status(201).send({
      msg: "Restaurante registrado exitosamente. Requiere activación previa por un administrador.",
      _id: userStored._id,
      restaurantId: restaurantStored._id,
      name: restaurantStored.name,
      email: userStored.email,
      role: userStored.role,
      active: userStored.active,
      image: restaurantStored.image,
    });
  } catch (error) {
    if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
    console.error("Error en registerRestaurant:", error);
    return res.status(500).send({ msg: "Error al registrar el restaurante.", error: error.message });
  }
}

// 3. POST /auth/registerDriver
async function registerDriver(req, res) {
  try {
    const {
      firstName,
      firstname,
      lastName,
      lastname,
      email,
      password,
      phone,
      vehicleType,
      plate,
      vehiclePlate,
      licensePlate,
      licenseNumber,
      avatar,
    } = req.body;

    const fName = firstName || firstname;
    const lName = lastName || lastname || "";

    if (!email || !password || !fName || !phone) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({ msg: "Los campos nombre, email, contraseña y teléfono son obligatorios." });
    }

    const emailClean = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailClean });

    if (existingUser) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({ msg: "El correo electrónico ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let avatarPath = avatar || null;
    if (req.files && req.files.avatar) {
      avatarPath = imageUtil.getFilePath(req.files.avatar);
    }

    const user = new User({
      firstName: fName,
      lastName: lName,
      email: emailClean,
      password: hashPassword,
      phone,
      role: "driver",
      active: false, // 👈 Se mantiene requiring aprobación
      avatar: avatarPath,
    });

    const userStored = await user.save();

    let normalizedVehicle = (vehicleType || "").toUpperCase().trim();
    if (normalizedVehicle === "MOTO" || normalizedVehicle === "MOTORCYCLE" || !normalizedVehicle) {
      normalizedVehicle = "MOTORCYCLE";
    } else if (normalizedVehicle === "BICI" || normalizedVehicle === "BICICLETA" || normalizedVehicle === "BICYCLE") {
      normalizedVehicle = "BICYCLE";
    } else if (normalizedVehicle === "AUTO" || normalizedVehicle === "CARRO" || normalizedVehicle === "CAR") {
      normalizedVehicle = "CAR";
    } else if (normalizedVehicle === "PIE" || normalizedVehicle === "WALK" || normalizedVehicle === "WALKING") {
      normalizedVehicle = "WALKING";
    }

    const driver = new Driver({
      user: userStored._id,
      vehicleType: normalizedVehicle,
      vehiclePlate: vehiclePlate || licensePlate || plate || null,
      licenseNumber: licenseNumber || null,
    });

    const driverStored = await driver.save();

    return res.status(201).send({
      msg: "Repartidor registrado exitosamente. Requiere activación previa.",
      _id: userStored._id,
      driverId: driverStored._id,
      firstName: userStored.firstName,
      lastName: userStored.lastName,
      email: userStored.email,
      role: userStored.role,
      active: userStored.active,
      vehicleType: driverStored.vehicleType,
      vehiclePlate: driverStored.vehiclePlate,
    });
  } catch (error) {
    if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
    console.error("Error en registerDriver:", error);
    return res.status(500).send({ msg: "Error al registrar el repartidor.", error: error.message });
  }
}

// 4. POST /auth/registerAdmin
async function registerAdmin(req, res) {
  try {
    const { firstName, firstname, lastName, lastname, email, password, phone, address, district } = req.body;
    const fName = firstName || firstname;
    const lName = lastName || lastname || "";

    if (!fName || !email || !password) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({ msg: "El nombre, email y contraseña son obligatorios." });
    }

    const emailClean = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailClean });

    if (existingUser) {
      if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
      return res.status(400).send({ msg: "El correo electrónico ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let avatarPath = null;
    if (req.files && req.files.avatar) {
      avatarPath = imageUtil.getFilePath(req.files.avatar);
    }

    const user = new User({
      firstName: fName,
      lastName: lName,
      email: emailClean,
      password: hashPassword,
      phone: phone || "",
      address: address || "",
      district: district || "",
      avatar: avatarPath,
      role: "admin",
      active: true,
      status: "active",
    });

    const userStored = await user.save();

    const userResponse = userStored.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse.createdAt;
    delete userResponse.updatedAt;

    return res.status(201).send(userResponse);
  } catch (error) {
    if (req.files && req.files.avatar) imageUtil.removeFile(req.files.avatar.path);
    console.error("Error en registerAdmin:", error);
    return res.status(500).send({ msg: "Error del servidor al registrar el administrador.", error: error.message });
  }
}

// 5. POST /auth/login (SE AÑADE RETORNO DEL USUARIO)
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ msg: "El email y la contraseña son obligatorios." });
    }

    const emailClean = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailClean });

    if (!user) {
      return res.status(404).send({ msg: "Usuario o contraseña incorrectos." });
    }

    // ⛔ Si el administrador NO ha activado esta cuenta, se bloquea la entrada con mensaje explicativo
    if (!user.active) {
      return res.status(403).send({ 
        msg: "Acceso no permitido. Tu cuenta está inactiva o pendiente de activación por un administrador." 
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).send({ msg: "Usuario o contraseña incorrectos." });
    }

    const accessToken = jwt.createAccessToken(user);
    const refreshToken = jwt.createRefreshToken(user);

    // Búsqueda del ID del restaurante para enviarlo si el usuario es un restaurante
    let restaurantData = null;
    if (user.role === "restaurant") {
      restaurantData = await Restaurant.findOne({ user: user._id });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).send({
      access: accessToken,
      refresh: refreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        ...userResponse,
        restaurantId: restaurantData ? restaurantData._id : null
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).send({ msg: "Error en el servidor al iniciar sesión." });
  }
}

// 6. GET /auth/me
async function getMe(req, res) {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id).select("-password");

    if (!user) {
      return res.status(404).send({ msg: "Usuario no encontrado." });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error("Error en getMe:", error);
    return res.status(500).send({ msg: "Error en el servidor al obtener el perfil." });
  }
}

// 7. POST /auth/refreshAccessToken
async function refreshAccessToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).send({ msg: "El token de refresco es obligatorio." });
    }

    const decodeFn = jwt.decoded || jwt.decodedToken;
    const decodedData = decodeFn(token);

    if (!decodedData || !decodedData.user_id) {
      return res.status(400).send({ msg: "El token no es válido o ya ha expirado." });
    }

    const user = await User.findById(decodedData.user_id);

    if (!user || !user.active) {
      return res.status(404).send({ msg: "Usuario no encontrado o inactivo." });
    }

    const accessToken = jwt.createAccessToken(user);
    return res.status(200).send({ 
      access: accessToken,
      accessToken: accessToken 
    });
  } catch (error) {
    console.error("Error en refreshAccessToken:", error);
    return res.status(400).send({ msg: "El token no es válido o ya ha expirado." });
  }
}

module.exports = {
  registerClient,
  registerRestaurant,
  registerDriver,
  registerAdmin,
  login,
  getMe,
  refreshAccessToken,
};