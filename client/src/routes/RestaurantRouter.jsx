import { Routes, Route, Navigate } from "react-router-dom";
import { RestaurantLayout } from "@/layouts";
import { RequireRole } from "./RequireRole";
import { ROLES } from "@/utils";
import {
  RestaurantLoginPage,
  RestaurantRegisterPage,
  RestaurantDashboardPage,
} from "@/pages/restaurant";

export const RestaurantRouter = () => {
  // Garantizamos compatibilidad de roles
  const restaurantRoles = [
    ROLES?.RESTAURANT, 
    "restaurant", 
    "RESTAURANT", 
    "partner", 
    "PARTNER"
  ].filter(Boolean);

  return (
    <Routes>
      {/* 1. Rutas Públicas de Autenticación */}
      <Route path="login" element={<RestaurantLoginPage />} />
      <Route path="register" element={<RestaurantRegisterPage />} />

      {/* 2. Rutas Protegidas para el Socio Restaurante */}
      <Route 
        element={
          <RequireRole 
            allowedRoles={restaurantRoles} 
            redirectTo="/restaurant/login" 
          />
        }
      >
        <Route element={<RestaurantLayout />}>
          <Route path="dashboard" element={<RestaurantDashboardPage />} />
        </Route>
      </Route>

      {/* 3. Redirecciones por defecto seguras */}
      <Route path="" element={<Navigate to="login" replace />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default RestaurantRouter;