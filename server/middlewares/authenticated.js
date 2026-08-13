const jwt = require("../utils/jwt");

/**
 * Middleware para verificar si la petición incluye un Token de Acceso válido.
 */
function ensureAuth(req, res, next) {
  // 1. Verificar si existe la cabecera 'Authorization'
  if (!req.headers.authorization) {
    return res.status(401).json({ 
      status: "error",
      msg: "La petición no tiene la cabecera de autenticación." 
    });
  }

  // 2. Extraer el token (eliminando 'Bearer ' si viene incluido)
  const token = req.headers.authorization.replace(/^Bearer\s+/, "").trim();

  if (!token) {
    return res.status(401).json({ 
      status: "error",
      msg: "El token de autenticación está vacío." 
    });
  }

  try {
    // 3. Decodificar el token
    const payload = jwt.decodedToken(token);

    // Si el token expiró o la firma es inválida
    if (!payload) {
      return res.status(401).json({ 
        status: "error",
        msg: "Token inválido, manipulado o expirado." 
      });
    }

    // 4. Validar la fecha de expiración si existe en el payload
    const { exp } = payload;
    const currentSecs = Math.floor(Date.now() / 1000);

    if (exp && exp <= currentSecs) {
      return res.status(401).json({ 
        status: "error",
        msg: "El token ha expirado." 
      });
    }

    // 5. Normalizar el objeto req.user para evitar 'undefined' en los controladores
    const extractedId = 
      payload.user_id || 
      payload._id || 
      payload.id || 
      payload.sub || 
      (payload.user && (payload.user._id || payload.user.id));

    req.user = {
      ...payload,
      _id: extractedId,
      id: extractedId,
      user_id: extractedId,
    };

    next();
  } catch (error) {
    console.error("Error en ensureAuth:", error.message);
    return res.status(401).json({ 
      status: "error",
      msg: "Error al procesar la autenticación." 
    });
  }
}

module.exports = {
  ensureAuth,
  asureAuth: ensureAuth, // Alias para compatibilidad
};