import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context";
import { 
  FiMapPin, 
  FiCreditCard, 
  FiDollarSign, 
  FiShoppingBag,
  FiCheckCircle 
} from "react-icons/fi";
import "./CheckoutPage.scss";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3977/api/v1";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // Estados del Formulario
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  
  // 🟢 ESTADO ÚNICO INTELIGENTE PARA EL COMENTARIO DEL PAGO SELECCIONADO
  const [paymentNote, setPaymentNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Helper Token JWT
  const getAuthToken = () => {
    let rawToken = 
      localStorage.getItem("client_token_jwt") ||
      localStorage.getItem("auth_token_jwt") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access");

    return rawToken ? rawToken.replace(/^"(.*)"$/, "$1").trim() : null;
  };

  // Cargar Perfil de Usuario al iniciar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/client/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return;
        const clientData = await res.json();

        setCurrentUser(clientData);

        if (clientData.defaultPaymentMethod) {
          setPaymentMethod(clientData.defaultPaymentMethod);
        }

        if (clientData.addresses && clientData.addresses.length > 0) {
          const defaultAddr = clientData.addresses.find(a => a.isDefault) || clientData.addresses[0];
          if (defaultAddr) {
            setAddress(defaultAddr.address || "");
            setReference(defaultAddr.reference || "");
          }
        }
      } catch (err) {
        console.error("No se pudo cargar la información del cliente:", err);
      }
    };

    fetchUserProfile();
  }, []);

  // Limpiar/Reiniciar el texto del comentario si el usuario cambia de método de pago
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentNote(""); // Limpia la nota para no mezclar datos de distintos métodos
  };

  // Cálculos del Carrito
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price || item.precio || 0);
    const qty = Number(item.quantity || item.cant || 1);
    return acc + price * qty;
  }, 0);

  const deliveryFee = subtotal > 0 ? 2.50 : 0;
  const grandTotal = subtotal + deliveryFee;

  // 🚀 ENVÍO DE LA ORDEN AL BACKEND
  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const isValidObjectId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

    const hasInvalidProducts = cartItems.some(
      (item) => !isValidObjectId(String(item._id || item.id))
    );

    if (hasInvalidProducts) {
      alert("Tu carrito contiene productos no válidos. Limpia el carrito y vuelve a agregar productos.");
      return;
    }

    // Validar comentario para Efectivo
    if (paymentMethod === "CASH" && !paymentNote.trim()) {
      alert("Por favor ingresa con cuánto vas a pagar para poder llevar tu vuelto.");
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        alert("Debes iniciar sesión como cliente para realizar un pedido.");
        setLoading(false);
        return;
      }

      const firstItem = cartItems[0];
      const firstProductId = firstItem._id || firstItem.id;

      let restaurantId = 
        firstItem?.restaurant?._id || 
        firstItem?.restaurant || 
        firstItem?.restaurantId || 
        firstItem?.restaurant_id ||
        firstItem?.vendor;

      if (!restaurantId || !isValidObjectId(String(restaurantId))) {
        try {
          const productRes = await fetch(`${API_URL}/products/${firstProductId}`);
          if (productRes.ok) {
            const productData = await productRes.json();
            restaurantId = productData?.restaurant?._id || productData?.restaurant || productData?.restaurantId;
          }
        } catch (fetchErr) {
          console.warn("No se pudo obtener el restaurante desde la API:", fetchErr);
        }
      }

      if (!restaurantId || !isValidObjectId(String(restaurantId))) {
        alert("No se pudo asociar el restaurante. Vacía el carrito y vuelve a intentar.");
        setLoading(false);
        return;
      }

      const fullAddress = `${address} ${reference ? `(Ref: ${reference})` : ""}`;

      const formattedItems = cartItems.map((item) => ({
        product: item._id || item.id,
        name: item.name || item.title || "Producto",
        quantity: Number(item.quantity || item.cant || 1),
        price: Number(item.price || item.precio || 0)
      }));

      const userId = currentUser?._id || currentUser?.id || currentUser?.user;
      
      const clientName = currentUser
        ? `${currentUser.firstName || currentUser.name || ""} ${currentUser.lastName || ""}`.trim()
        : "Cliente Rappi";
        
      const clientPhone = currentUser?.phone || currentUser?.phoneNumber || "";

      // 🟢 COMPOSICIÓN FINAL DE LA NOTA PARA ENVIAR AL BACKEND
      let formattedNote = "";
      if (paymentNote.trim()) {
        if (paymentMethod === "CARD") formattedNote = `Tarjeta: ${paymentNote.trim()}`;
        else if (paymentMethod === "YAPE") formattedNote = `Yape/Plin: ${paymentNote.trim()}`;
        else if (paymentMethod === "CASH") formattedNote = `Paga con S/ ${paymentNote.trim()}`;
      }

      const payload = {
        user: userId,
        customerName: clientName,
        customerPhone: clientPhone,
        restaurant: String(restaurantId),
        items: formattedItems,
        total: grandTotal,
        deliveryFee,
        address: fullAddress,
        paymentMethod: paymentMethod.toUpperCase(),
        notes: formattedNote,
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || data.message || "Error al procesar el pedido");

      alert("¡Pedido realizado con éxito! 🛵");
      clearCart();
      navigate("/"); 
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkoutContainer">
      <div className="checkoutHeader">
        <div className="titleWrapper">
          <div className="iconBadge">
            <FiCheckCircle />
          </div>
          <div>
            <h1>Finalizar Compra</h1>
            <p className="subtitle">Revisa tu dirección y método de pago para completar la orden</p>
          </div>
        </div>
      </div>

      <div className="checkoutGrid">
        <form className="addressSection" onSubmit={handleConfirmOrder}>
          <div className="formGroupBlock">
            <h2><FiMapPin /> Dirección de Entrega</h2>
            <div className="formContent">
              <input 
                type="text" 
                placeholder="Dirección de la calle, número" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required 
              />
              <input 
                type="text" 
                placeholder="Referencias (Ej. Portón blanco, Depto 201)" 
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          {/* MÉTODOS DE PAGO INTERACTIVOS */}
          <div className="formGroupBlock">
            <h2><FiCreditCard /> Método de Pago</h2>
            
            <div className="paymentMethodsGrid">

              {/* 1. TARJETA */}
              <label className={`paymentOption ${paymentMethod === "CARD" ? "active" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="CARD" 
                  checked={paymentMethod === "CARD"}
                  onChange={() => handlePaymentMethodChange("CARD")}
                />
                <div className="paymentBadge cardBadge">
                  <span className="chip"></span>
                  <FiCreditCard className="icon" />
                </div>
                <div className="paymentText">
                  <span className="title">Tarjeta Crédito / Débito</span>
                  <span className="subtext">Visa, Mastercard, AMEX</span>
                </div>
              </label>

              {/* 2. YAPE / PLIN */}
              <label className={`paymentOption ${paymentMethod === "YAPE" ? "active" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="YAPE" 
                  checked={paymentMethod === "YAPE"}
                  onChange={() => handlePaymentMethodChange("YAPE")}
                />
                <div className="paymentBadge yapePlinBadge">
                  <svg viewBox="0 0 100 100" className="svgLogoPlin" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="plinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00e5d4" />
                        <stop offset="100%" stopColor="#007bff" />
                      </linearGradient>
                    </defs>
                    <path d="M 50,5 C 75,5 95,23 95,48 C 95,73 75,93 50,93 C 35,93 22,86 14,75 C 6,85 2,95 2,95 C 2,95 7,80 6,70 C 2,63 5,55 5,48 C 5,23 25,5 50,5 Z" fill="url(#plinGrad)" />
                    <text x="45" y="63" fill="#ffffff" fontSize="30" fontWeight="900" textAnchor="middle" fontFamily="'Arial Black', sans-serif" letterSpacing="-1">plın</text>
                    <circle cx="61" cy="38" r="4.5" fill="#ff2b85" />
                  </svg>

                  <svg viewBox="0 0 100 100" className="svgLogoYape" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="yapeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8a00b8" />
                        <stop offset="100%" stopColor="#5d0082" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="100" height="100" rx="22" fill="url(#yapeBg)" />
                    <path d="M 62,12 C 73,12 82,20 82,31 C 82,40 75,47 66,50 L 62,56 L 61,49 C 54,47 49,40 49,31 C 49,20 58,12 62,12 Z" fill="#00d5c3" />
                    <text x="65" y="35" fill="#66008e" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="'Arial Black', sans-serif">S/</text>
                    <text x="50" y="73" fill="#ffffff" fontSize="33" fontWeight="bold" fontStyle="italic" textAnchor="middle" fontFamily="'Trebuchet MS', 'Arial Black', sans-serif">yape</text>
                    <path d="M 22,79 Q 50,77 78,71" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <div className="paymentText">
                  <span className="title">Yape / Plin</span>
                  <span className="subtext">Pago rápido con QR o número</span>
                </div>
              </label>

              {/* 3. EFECTIVO */}
              <label className={`paymentOption ${paymentMethod === "CASH" ? "active" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="CASH" 
                  checked={paymentMethod === "CASH"}
                  onChange={() => handlePaymentMethodChange("CASH")}
                />
                <div className="paymentBadge cashBadge">
                  <FiDollarSign className="icon" />
                </div>
                <div className="paymentText">
                  <span className="title">Efectivo contra entrega</span>
                  <span className="subtext">Paga al recibir tu pedido</span>
                </div>
              </label>

            </div>

            {/* =========================================================================
                DESPLIEGUE DINÁMICO DEL CAMPO SEGÚN LA OPCIÓN SELECCIONADA
                ========================================================================= */}
            {paymentMethod === "CARD" && (
              <div className="extraPaymentInfo">
                <label>Notas de la tarjeta o instrucción adicional (Opcional):</label>
                <input 
                  type="text" 
                  placeholder="Ej: Solicito POS físico Visa / Pago con Débito"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === "YAPE" && (
              <div className="extraPaymentInfo">
                <label>Número de Yape/Plin o N° de Operación (Opcional):</label>
                <input 
                  type="text" 
                  placeholder="Ej: Yapeado desde el 912345678 / Op: 849302"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === "CASH" && (
              <div className="extraPaymentInfo">
                <label>¿Con cuánto vas a pagar? (Para llevar vuelto)</label>
                <input 
                  type="number" 
                  placeholder={`Ej: ${Math.ceil(grandTotal + 10)}`}
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  required
                />
              </div>
            )}

          </div>

          <button type="submit" className="confirmBtn" disabled={loading || cartItems.length === 0}>
            {loading ? "Enviando Orden..." : "Confirmar Pedido"}
          </button>
        </form>

        {/* RESUMEN DERECHA */}
        <div className="summarySection">
          <h2><FiShoppingBag /> Resumen de la Orden</h2>
          
          {cartItems.length === 0 ? (
            <p className="emptyCartText">No tienes productos en el carrito.</p>
          ) : (
            <div className="summaryContent">
              <ul className="itemsList">
                {cartItems.map((item, idx) => {
                  const qty = item.quantity || item.cant || 1;
                  const price = Number(item.price || item.precio || 0);
                  const name = item.name || item.title || "Producto";

                  return (
                    <li key={idx} className="itemRow">
                      <span className="qty">{qty}x</span>
                      <span className="name">{name}</span>
                      <span className="price">S/ {(price * qty).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="divider" />

              <div className="calcRow">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="calcRow">
                <span>Envío</span>
                <span>S/ {deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="calcRow totalRow">
                <span>Total</span>
                <span>S/ {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;