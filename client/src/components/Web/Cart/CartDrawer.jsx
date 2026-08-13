import { useState, useEffect } from "react";
import { 
  FiX, 
  FiShoppingBag, 
  FiCompass, 
  FiMapPin, 
  FiZap, 
  FiShield, 
  FiLoader 
} from "react-icons/fi";
import { useCart } from "@/context";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import "./CartDrawer.scss";

const CartDrawer = () => {
  const { 
    cartItems: items, 
    isCartOpen: isOpen, 
    closeCart: onClose, 
    updateQuantity: onUpdateQuantity, 
    removeFromCart: onRemoveItem 
  } = useCart();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState("");
  const [inputAddress, setInputAddress] = useState("");

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  // Sincronizar dirección de entrega de sesión
  useEffect(() => {
    const syncCartAddress = () => {
      let currentUser = null;
      try {
        const rawUser = localStorage.getItem("user") || localStorage.getItem("userData");
        if (rawUser) currentUser = JSON.parse(rawUser);
      } catch {
        currentUser = null;
      }

      const directAddress = localStorage.getItem("user_delivery_address");

      if (!currentUser && !directAddress) {
        setSavedAddress("");
        setInputAddress("");
        return;
      }

      const activeAddress = directAddress || currentUser?.address?.street || currentUser?.address || "";
      setSavedAddress(activeAddress);
      setInputAddress(activeAddress);
    };

    syncCartAddress();

    window.addEventListener("auth-change", syncCartAddress);
    window.addEventListener("storage", syncCartAddress);

    return () => {
      window.removeEventListener("auth-change", syncCartAddress);
      window.removeEventListener("storage", syncCartAddress);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("La geolocalización no está soportada por tu navegador.");
      return;
    }

    setIsLocating(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "Accept-Language": "es",
                "User-Agent": "DeliveryApp/1.0"
              }
            }
          );
          const data = await response.json();

          if (data && data.display_name) {
            const road = data.address?.road || data.address?.pedestrian || "";
            const houseNumber = data.address?.house_number || "";
            const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.city || "";
            
            const formattedAddress = road 
              ? `${road} ${houseNumber}${suburb ? `, ${suburb}` : ""}`
              : data.display_name.split(",").slice(0, 3).join(",");

            setInputAddress(formattedAddress);
          } else {
            setInputAddress(`Ubicación GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          }
        } catch {
          setInputAddress(`Ubicación GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === 1) {
          setGeoError("Permiso denegado. Activa la ubicación en tu navegador.");
        } else if (error.code === 2) {
          setGeoError("Ubicación no disponible en este dispositivo.");
        } else if (error.code === 3) {
          setGeoError("Tiempo de espera agotado al obtener ubicación.");
        } else {
          setGeoError("Error al obtener la ubicación.");
        }
      },
      { 
        timeout: 15000, 
        enableHighAccuracy: false, 
        maximumAge: 60000 
      }
    );
  };

  const handleSaveAddress = () => {
    if (!inputAddress.trim()) return;
    
    setSavedAddress(inputAddress);
    localStorage.setItem("user_delivery_address", inputAddress);
    window.dispatchEvent(new Event("storage"));
    setShowAddressModal(false);
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer-container" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER Y SELECTOR DE DIRECCIÓN */}
        <div className="drawer-header">
          <div className="header-top">
            3. Mi Carrito
            <button type="button" className="close-drawer" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <div className="address-selector-wrapper">
            <button 
              type="button"
              className="address-selector-btn"
              onClick={() => {
                setShowAddressModal(!showAddressModal);
                setGeoError("");
              }}
            >
              <span className="dot"></span>
              <span className="text">
                {savedAddress ? savedAddress : "Ingresa tu ubicación"}
              </span>
              <span className="arrow">{showAddressModal ? "▲" : "▼"}</span>
            </button>

            {showAddressModal && (
              <div className="address-dropdown">
                <p className="title">DIRECCIÓN DE ENTREGA</p>
                
                <button 
                  type="button"
                  className="btn-gps" 
                  onClick={handleGetLocation}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <>
                      <FiLoader className="spinner" /> Obteniendo ubicación...
                    </>
                  ) : (
                    <>
                      <FiCompass /> Usar mi ubicación actual (GPS)
                    </>
                  )}
                </button>

                {geoError && <p className="geo-error-msg">{geoError}</p>}

                <div className="divider">O INGRESAR MANUALMENTE</div>

                <div className="input-group">
                  <FiMapPin className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Ej. Av. Javier Prado Este 123, San Isidro" 
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                  />
                </div>

                <button 
                  type="button"
                  className={`btn-save-address ${inputAddress.trim() ? "active" : ""}`}
                  onClick={handleSaveAddress}
                  disabled={!inputAddress.trim()}
                >
                  Guardar y Usar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CUERPO DEL CARRITO */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart-container">
              <div className="bag-icon-wrapper">
                <FiShoppingBag className="bag-icon" />
              </div>
              <h4>Su carrito está vacío</h4>
              <p>Explore nuestro catálogo de restaurantes y agregue sus productos preferidos.</p>
              
              <button type="button" className="btn-explore" onClick={onClose}>
                Explorar Restaurantes &rarr;
              </button>
            </div>
          ) : (
            <div className="items-list">
              {items.map((item) => (
                <CartItem
                  key={item.id || item._id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}

          <div className="features-list">
            <div className="feature-item">
              <FiZap className="feature-icon" />
              <span>Envíos rápidos (~30 min)</span>
            </div>
            <div className="feature-item">
              <FiShield className="feature-icon" />
              <span>Seguimiento en tiempo real</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="drawer-footer">
          <CartSummary />
        </div>

      </div>
    </div>
  );
};

export default CartDrawer;