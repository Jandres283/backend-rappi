import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/context/AuthContext";
import { ROLES } from "@/utils";

export const ProtectedAdminRoute = ({ allowedRoles = [ROLES?.ADMIN || "admin"] }) => {
  const { user, token, loading, isLoading } = useAuth();

  const isAuthLoading = loading || isLoading;

  if (isAuthLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#111827', color: '#fff' }}>
        Verificando credenciales de administración...
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const normalizedAllowedRoles = rolesArray.map(r => String(r).toLowerCase().trim());
  const currentUserRole = String(user?.role || "").toLowerCase().trim();

  const hasAccess = currentUserRole === "admin" || normalizedAllowedRoles.includes(currentUserRole);

  if (!hasAccess) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;