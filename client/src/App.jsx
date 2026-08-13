import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AuthProvider,
  CartProvider,
  DriverProvider,
  RestaurantProvider,
} from "@/context";

import {
  AdminRouter,
  DriverRouter,
  RestaurantRouter,
  WebRouter,
} from "@/routes";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <DriverProvider>
            <RestaurantProvider>
              <Routes>
                {/* Módulos con prioridad explícita */}
                <Route path="/admin/*" element={<AdminRouter />} />
                <Route path="/driver/*" element={<DriverRouter />} />
                <Route path="/restaurant/*" element={<RestaurantRouter />} />

                {/* Cliente / Tienda Pública */}
                <Route path="/*" element={<WebRouter />} />
              </Routes>
            </RestaurantProvider>
          </DriverProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;