const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");

/**
 * Genera el Access Token (Válido por 24 horas)
 */
function createAccessToken(user) {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);

  const payload = {
    token_type: "access",
    user_id: user._id,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expirationDate.getTime() / 1000),
  };

  return jwt.sign(payload, JWT_SECRET_KEY);
}

/**
 * Genera el Refresh Token (Válido por 30 días)
 */
function createRefreshToken(user) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  const payload = {
    token_type: "refresh",
    user_id: user._id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expirationDate.getTime() / 1000),
  };

  return jwt.sign(payload, JWT_SECRET_KEY);
}

/**
 * Decodifica y verifica la validez del token de manera segura
 */
function decodedToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    // Si la firma no coincide o venció, retorna null en lugar de romper la app
    return null;
  }
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  decodedToken,
  decoded: decodedToken, 
};