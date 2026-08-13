import { Routes, Route, Navigate } from "react-router-dom";
import { RequireRole } from "./RequireRole";
import { ROLES } from "@/utils";
import {
  DriverLoginPage,
  DriverRegisterPage,
  DriverDashboardPage,
} from "@/pages/driver";

export const DriverRouter = () => {
  const driverRole = ROLES?.DRIVER || "driver";

  return (
    <Routes>
      {/* 🟢 1. Rutas públicas del repartidor */}
      <Route path="login" element={<DriverLoginPage />} />
      <Route path="register" element={<DriverRegisterPage />} />

      {/* 🟢 2. Rutas protegidas para el repartidor */}
      <Route
        element={
          <RequireRole
            allowedRoles={[driverRole]}
            redirectTo="/driver/login"
          />
        }
      >
        <Route path="dashboard" element={<DriverDashboardPage />} />
        <Route path="available" element={<DriverDashboardPage />} />
        <Route path="active" element={<DriverDashboardPage />} />
        <Route path="history" element={<DriverDashboardPage />} />
      </Route>

      {/* 🟢 3. Redirecciones seguras dentro del módulo /driver */}
      <Route path="" element={<Navigate to="login" replace />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default DriverRouter;