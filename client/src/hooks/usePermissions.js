// src/hooks/usePermissions.js
import { useAuth } from "./useAuth";

export const usePermissions = () => {
  const { user, role } = useAuth();

  const isClient = role === "client" || user?.role === "client";
  const isRestaurant = role === "restaurant" || user?.role === "restaurant";
  const isDriver = role === "driver" || user?.role === "driver";
  const isAdmin = role === "admin" || user?.role === "admin";

  const hasRole = (allowedRoles = []) => {
    if (!allowedRoles.length) return true;
    return allowedRoles.includes(role || user?.role);
  };

  return {
    role: role || user?.role || null,
    isClient,
    isRestaurant,
    isDriver,
    isAdmin,
    hasRole,
  };
};

export default usePermissions;