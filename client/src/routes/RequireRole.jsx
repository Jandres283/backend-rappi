import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const RequireRole = ({ allowedRoles = [], redirectTo }) => {
  const { user, token, loading, isLoading } = useAuth();
  const location = useLocation();

  if (loading || isLoading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          background: "#f9fafb",
          color: "#374151",
        }}
      >
        <h3>Verificando permisos...</h3>
      </div>
    );
  }

  const currentPath = location.pathname.toLowerCase();
  const isDriverRoute = currentPath.startsWith("/driver") || currentPath.startsWith("/repartidor");
  const isAdminRoute = currentPath.startsWith("/admin");
  const isRestaurantRoute = currentPath.startsWith("/restaurant") || currentPath.startsWith("/socio");

  // Fallback de redirección aislado por sección
  const defaultRedirect = redirectTo || (
    isDriverRoute
      ? "/driver/login"
      : isAdminRoute
      ? "/admin/login"
      : isRestaurantRoute
      ? "/restaurant/login"
      : "/auth"
  );

  let activeUser = user;
  let activeToken = token;

  // Búsqueda prioritaria aislada en localStorage para la sección actual
  if (!activeUser || !activeToken) {
    try {
      const targetRole = isDriverRoute
        ? "driver"
        : isAdminRoute
        ? "admin"
        : isRestaurantRoute
        ? "restaurant"
        : "client";

      const storedUser = localStorage.getItem(`${targetRole}_user_data`);
      const storedToken = localStorage.getItem(`${targetRole}_token_jwt`);

      if (storedUser && storedToken) {
        activeUser = JSON.parse(storedUser);
        activeToken = storedToken;
      }
    } catch (e) {
      console.error("Error al recuperar sesión aislada en RequireRole:", e);
    }
  }

  // Si no hay token o no existe usuario activo
  if (!activeUser || !activeToken) {
    return <Navigate to={defaultRedirect} replace />;
  }

  const currentUserRole = String(
    activeUser.role || (activeUser.user && activeUser.user.role) || ""
  )
    .toLowerCase()
    .trim();

  const normalizedAllowed = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles])
    .filter(Boolean)
    .map((r) => String(r).toLowerCase().trim());

  const hasAccess = normalizedAllowed.includes(currentUserRole);

  if (!hasAccess) {
    return <Navigate to={defaultRedirect} replace />;
  }

  return <Outlet />;
};

export default RequireRole;