/**
 * Middleware para restringir rutas según el rol del usuario.
 * @param {Array<String>|String} allowedRoles - Ejemplo: ['admin', 'delivery', 'restaurant', 'client']
 */
function isRole(allowedRoles = []) {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const normalizedAllowedRoles = rolesArray.map((r) => String(r).toLowerCase().trim());

  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ status: "error", msg: "Usuario no autenticado." });
      }

      // 1. Extraer el rol sin importar dónde venga en el token/objeto user
      const rawRole =
        req.user.role ||
        req.user.roles ||
        req.user.type ||
        (req.user.user && req.user.user.role);

      // 2. Convertir todos los roles del usuario en una lista/arreglo plano
      let userRolesList = [];

      if (Array.isArray(rawRole)) {
        userRolesList = rawRole;
      } else if (typeof rawRole === "object" && rawRole !== null) {
        const roleVal = rawRole.name || rawRole.role || rawRole.type || "";
        if (roleVal) userRolesList.push(roleVal);
      } else if (rawRole) {
        userRolesList.push(rawRole);
      }

      // 3. Normalizar todos los roles del usuario (minúsculas y sin espacios)
      const normalizedUserRoles = userRolesList
        .map((r) => String(r).toLowerCase().trim())
        .filter(Boolean);

      if (normalizedUserRoles.length === 0) {
        console.warn("⚠️ [isRole] El usuario no tiene una propiedad 'role' válida:", req.user);
        return res.status(403).json({
          status: "error",
          msg: "Acceso denegado: Rol no especificado en el token de usuario.",
        });
      }

      console.log(
        `🔍 [Check Role] Usuario: "${req.user.email || req.user.user_id || req.user._id}" | Roles del usuario:`,
        normalizedUserRoles,
        `| Requeridos:`,
        normalizedAllowedRoles
      );

      // 4. Verificar si AL MENOS UNO de los roles del usuario coincide con los permitidos
      const hasPermission = normalizedUserRoles.some((role) =>
        normalizedAllowedRoles.includes(role)
      );

      if (!hasPermission) {
        return res.status(403).json({
          status: "error",
          msg: `Acceso denegado: Tus permisos [${normalizedUserRoles.join(", ")}] no incluyen los requeridos: [${normalizedAllowedRoles.join(", ")}]`,
        });
      }

      next();
    } catch (error) {
      console.error("Error en middleware isRole:", error);
      return res.status(500).json({ status: "error", msg: "Error interno al verificar permisos." });
    }
  };
}

// Helpers / Atajos individuales
const isAdmin = isRole(["admin"]);
const isClient = isRole(["client"]);
const isRestaurant = isRole(["restaurant"]);
const isDriver = isRole(["delivery", "driver"]);

// Helpers / Atajos combinados
const isRestaurantOrAdmin = isRole(["admin", "restaurant"]);

module.exports = {
  isRole,
  isAdmin,
  isClient,
  isRestaurant,
  isDriver,
  isRestaurantOrAdmin,
};