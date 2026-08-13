import { createContext, useContext, useState, useEffect } from "react";
import { ENV } from "@/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(ENV?.STORAGE?.CART || "app_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        ENV?.STORAGE?.CART || "app_cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;

    // Normalizar ID de producto y Restaurante
    const productId = product._id || product.id;
    const restaurantId =
      product.restaurant?._id ||
      product.restaurant ||
      product.restaurantId ||
      product.vendor;

    const normalizedProduct = {
      ...product,
      _id: productId,
      id: productId,
      restaurant: restaurantId,
      price: Number(product.price || product.precio || 0),
    };

    // 🟢 CONTROL DE RESTAURANTE DIVERGENTE (Evaluado con el estado actual):
    if (cartItems.length > 0) {
      const currentRest =
        cartItems[0].restaurant?._id ||
        cartItems[0].restaurant ||
        cartItems[0].restaurantId;

      if (
        currentRest &&
        restaurantId &&
        String(currentRest) !== String(restaurantId)
      ) {
        const confirmReset = window.confirm(
          "Tu carrito contiene productos de otro restaurante. ¿Deseas vaciar el carrito para agregar este producto?"
        );
        if (!confirmReset) return; // Si cancela, frena la operación por completo

        // Si acepta, reinicia el carrito con solo el nuevo producto
        setCartItems([{ ...normalizedProduct, quantity }]);
        setIsCartOpen(true);
        return;
      }
    }

    // Agregar o actualizar cantidad dentro del mismo restaurante
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(item._id || item.id) === String(productId)
      );

      if (existingIndex > -1) {
        return prev.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: (item.quantity || 0) + quantity }
            : item
        );
      }
      return [...prev, { ...normalizedProduct, quantity }];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id || item._id) === String(id)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => String(item.id || item._id) !== String(id))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = Number(item.price || item.precio || 0);
    const itemQty = Number(item.quantity || item.cant || 1);
    return acc + itemPrice * itemQty;
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => {
    return acc + Number(item.quantity || item.cant || 0);
  }, 0);

  const value = {
    cartItems,
    cart: cartItems,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom Hook exportado desde la misma definición del Contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export default CartProvider;