import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/Web/Header/Header";
import CartDrawer from "@/components/Web/Cart/CartDrawer";
import Footer from "@/components/Web/Footer/Footer";
import { useCart } from "@/context";
import "./ClientLayout.scss";

export const ClientLayout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  return (
    <div className="clientContainer">
      {/* Header global (consume useCart internamente para el badge y abrir el drawer) */}
      <Header onOpenAuth={() => navigate("/auth")} />

      <main className="mainContent">
        {/* Pasamos contexto al Outlet para vistas hijas si lo requieren */}
        <Outlet context={{ cartItems, navigate }} />
      </main>

      {/* CartDrawer global (consume useCart internamente para su visibilidad y acciones) */}
      <CartDrawer />

      {/* Footer global */}
      <Footer />
    </div>
  );
};

export default ClientLayout;