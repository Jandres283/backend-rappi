import { useNavigate } from "react-router-dom";
import { useCart } from "@/context";
import "./CartSummary.scss";

const CartSummary = ({ shippingCost = 2.50 }) => {
  const navigate = useNavigate();
  const { subtotal, cartItems, closeCart } = useCart();

  const finalShipping = cartItems.length > 0 ? shippingCost : 0;
  const total = subtotal + finalShipping;

  const handleProceedToCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Envío</span>
        <span>${finalShipping.toFixed(2)}</span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button 
        type="button"
        className="btn-checkout" 
        onClick={handleProceedToCheckout}
        disabled={cartItems.length === 0}
      >
        Proceder al Pago
      </button>
    </div>
  );
};

export default CartSummary;