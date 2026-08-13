import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/layouts";
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";

import {
  AdminLoginPage,
  ClientsPage,
  ContactsPage,
  NewsPage,
  OrdersPage,
  ProductsPage,
  RestaurantsPage,
  UsersPage,
} from "@/pages/admin";

export const AdminRouter = () => {
  return (
    <Routes>
      {/* Ruta pública de login */}
      <Route path="login" element={<AdminLoginPage />} />

      {/* Rutas protegidas con AdminLayout */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<OrdersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="restaurants" element={<RestaurantsPage />} />
        </Route>
      </Route>

      {/* Redirección comodín en caso de rutas inválidas */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRouter;