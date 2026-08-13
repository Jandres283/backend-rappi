import { useState, useEffect } from "react";
import { useCart } from "@/context";
import { 
  FiSearch, 
  FiShoppingCart, 
  FiStar, 
  FiShoppingBag, 
  FiClock, 
  FiGrid,
  FiCoffee,
  FiGift
} from "react-icons/fi";
import { 
  FaPizzaSlice, 
  FaHamburger, 
  FaFish, 
  FaReceipt, 
  FaUtensils, 
  FaIceCream,
  FaFire 
} from "react-icons/fa";
import "./DishesPage.scss";

// CATÁLOGO DE PLATILLOS LOCAL DE RESPALDO (12 PRODUCTOS)
const QUICK_DISHES = [
  { 
    _id: "qd-1", 
    id: "qd-1",
    name: "Pizza Pepperoni Familiar", 
    price: 35.90, 
    oldPrice: 45.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Pizzas",
    time: "20-30 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-2", 
    id: "qd-2",
    name: "Combo Double Bacon Burger", 
    price: 24.50, 
    oldPrice: 32.00, 
    isPopular: true, 
    rating: 4.8, 
    category: "Hamburguesas",
    time: "15-25 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-3", 
    id: "qd-3",
    name: "Roll Acevichado (12 pcs)", 
    price: 29.90, 
    oldPrice: 38.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Sushis",
    time: "20-35 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-4", 
    id: "qd-4",
    name: "Lasagna Bolognesa Artesanal", 
    price: 28.00, 
    oldPrice: 34.00, 
    isPopular: false, 
    rating: 4.7, 
    category: "Pastas",
    time: "25-40 min",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-5", 
    id: "qd-5",
    name: "1/4 Pollo a la Brasa + Papas", 
    price: 21.90, 
    oldPrice: 27.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Entradas",
    time: "20-30 min",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-6", 
    id: "qd-6",
    name: "Tacos al Pastor Especiales (3u)", 
    price: 22.00, 
    oldPrice: 28.00, 
    isPopular: true, 
    rating: 4.8, 
    category: "Entradas",
    time: "15-20 min",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-7", 
    id: "qd-7",
    name: "Ceviche Mixto Tradicional", 
    price: 32.50, 
    oldPrice: 40.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Entradas",
    time: "15-25 min",
    image: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-8", 
    id: "qd-8",
    name: "Alitas BBQ Crunch (8u)", 
    price: 23.90, 
    oldPrice: 30.00, 
    isPopular: true, 
    rating: 4.8, 
    category: "Entradas",
    time: "15-25 min",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-9", 
    id: "qd-9",
    name: "Cheesecake de Frutos Rojos", 
    price: 16.50, 
    oldPrice: 21.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Postres",
    time: "10 min",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-10", 
    id: "qd-10",
    name: "Milkshake de Chocolate Belga", 
    price: 15.00, 
    oldPrice: 18.50, 
    isPopular: false, 
    rating: 4.8, 
    category: "Bebidas",
    time: "5-10 min",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-11", 
    id: "qd-11",
    name: "Limonada Froze de Hierbabuena", 
    price: 12.00, 
    oldPrice: 15.00, 
    isPopular: true, 
    rating: 4.7, 
    category: "Bebidas",
    time: "5-10 min",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-12", 
    id: "qd-12",
    name: "Waffles con Helado y Nutella", 
    price: 19.90, 
    oldPrice: 24.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Postres",
    time: "10-15 min",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=500&q=80" 
  },
  // --- 🎁 LAS 4 PROMOS AGREGADAS ---
  { 
    _id: "qd-13", 
    id: "qd-13",
    name: "Promo Dúo Burger + Papas + Bebida", 
    price: 39.90, 
    oldPrice: 55.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Promos",
    time: "20 min",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-14", 
    id: "qd-14",
    name: "2x1 Pizza Familiar Pepperoni & Queso", 
    price: 49.90, 
    oldPrice: 70.00, 
    isPopular: true, 
    rating: 5.0, 
    category: "Promos",
    time: "25-30 min",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-15", 
    id: "qd-15",
    name: "Pack Familiar Pollo Brasa + Chicha 1.5L", 
    price: 59.90, 
    oldPrice: 78.00, 
    isPopular: true, 
    rating: 4.9, 
    category: "Promos",
    time: "30 min",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    _id: "qd-16", 
    id: "qd-16",
    name: "Promo Maki Box 24 Pcs + Bebida", 
    price: 45.90, 
    oldPrice: 62.00, 
    isPopular: true, 
    rating: 4.8, 
    category: "Promos",
    time: "25 min",
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=500&q=80" 
  }
];

const CATEGORIES = [
  { name: "Todos", icon: <FiGrid /> },
  { name: "Pizzas", icon: <FaPizzaSlice /> },
  { name: "Hamburguesas", icon: <FaHamburger /> },
  { name: "Sushis", icon: <FaFish /> },
  { name: "Pastas", icon: <FaReceipt /> },
  { name: "Entradas", icon: <FaUtensils /> },
  { name: "Bebidas", icon: <FiCoffee /> },
  { name: "Postres", icon: <FaIceCream /> },
  { name: "Promos", icon: <FiGift /> }
];

export const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Capturamos las funciones del carrito
  const cartContext = useCart() || {};
  const { addToCart, setCartItems, addCart } = cartContext;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dishes");
        if (!response.ok) throw new Error("API no disponible");

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const enrichedData = data.map((item, index) => {
            const fallback = QUICK_DISHES[index % QUICK_DISHES.length];
            return {
              ...item,
              id: item.id || item._id,
              _id: item._id || item.id,
              oldPrice: item.oldPrice !== undefined ? item.oldPrice : (item.price ? Number(item.price) * 1.25 : fallback.oldPrice),
              isPopular: item.isPopular !== undefined ? item.isPopular : (index % 2 === 0),
              time: item.time || fallback.time,
              rating: item.rating || fallback.rating,
              category: item.category || fallback.category
            };
          });
          setDishes(enrichedData);
        } else {
          setDishes(QUICK_DISHES);
        }
      } catch (err) {
        console.error("Cargando catálogo local de respaldo:", err);
        setDishes(QUICK_DISHES);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // FUNCIÓN MULTI-COMPATIBLE PARA AGREGAR AL CARRITO
  const handleAddToCart = (dish) => {
    const itemToAdd = {
      id: dish._id || dish.id,
      _id: dish._id || dish.id,
      name: dish.name,
      price: typeof dish.price === "number" ? dish.price : parseFloat(dish.price) || 0,
      image: dish.image,
      quantity: 1
    };

    // 1. Si tu context usa 'addToCart'
    if (typeof addToCart === "function") {
      addToCart(itemToAdd);
      return;
    }

    // 2. Si tu context usa 'addCart'
    if (typeof addCart === "function") {
      addCart(itemToAdd);
      return;
    }

    // 3. Si tu context pasa 'setCartItems' directamente
    if (typeof setCartItems === "function") {
      setCartItems((prev = []) => {
        const exists = prev.find((item) => (item.id || item._id) === itemToAdd.id);
        if (exists) {
          return prev.map((item) =>
            (item.id || item._id) === itemToAdd.id 
              ? { ...item, quantity: (item.quantity || 1) + 1 } 
              : item
          );
        }
        return [...prev, itemToAdd];
      });
      return;
    }

    // 4. Fallback a localStorage directo si la app usa persistencia nativa
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = storedCart.findIndex((i) => (i.id || i._id) === itemToAdd.id);

      if (existingIndex > -1) {
        storedCart[existingIndex].quantity = (storedCart[existingIndex].quantity || 1) + 1;
      } else {
        storedCart.push(itemToAdd);
      }

      localStorage.setItem("cart", JSON.stringify(storedCart));
      
      // Notificar a otros componentes que cambió el carrito
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error("Error al guardar en carrito:", e);
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name ? dish.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) : false;
    const matchesCategory = selectedCategory === "Todos" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dishesWrapper">
      {/* Banner Principal / Hero */}
      <div className="dishesHero">
        <div className="heroContent">
          <span className="heroBadge">
            <FaFire /> ¡Sabores Únicos!
          </span>
          <h2>Catálogo de Platillos</h2>
          <p>Encuentra tus platillos preferidos y pídelos en segundos.</p>
          
          <div className="searchBar">
            <FiSearch className="searchIcon" />
            <input
              type="text"
              placeholder="Buscar por nombre (ej. Pizza, Lasagna)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categorías AHORA FUERA DEL HERO */}
      <div className="categoriesWrapper">
        <div className="categoriesFilter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`catBtn ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="catIcon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="dishesContainer">
        {loading ? (
          <div className="loadingContainer">
            <div className="spinner"></div>
            <p>Cargando los mejores platillos...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="emptyState">
            <FiShoppingBag size={48} />
            <h3>No encontramos lo que buscas</h3>
            <p>Intenta cambiar el filtro o el término de búsqueda.</p>
          </div>
        ) : (
          <div className="dishesGrid">
            {filteredDishes.map((dish) => {
              const numPrice = typeof dish.price === "number" ? dish.price : parseFloat(dish.price) || 0;
              const numOldPrice = typeof dish.oldPrice === "number" ? dish.oldPrice : parseFloat(dish.oldPrice) || null;

              return (
                <div key={dish._id || dish.id} className="dishCard">
                  <div className="dishImageWrapper">
                    <img src={dish.image || "https://via.placeholder.com/400"} alt={dish.name} />
                    
                    {dish.isPopular && (
                      <span className="popularBadge">
                        <FaFire /> Popular
                      </span>
                    )}

                    <span className="ratingBadge">
                      <FiStar className="starIcon" /> {dish.rating || "4.5"}
                    </span>
                  </div>

                  <div className="dishContent">
                    <div className="metaRow">
                      <span className="categoryLabel">{dish.category || "General"}</span>
                      <span className="timeLabel">
                        <FiClock /> {dish.time || "20-30 min"}
                      </span>
                    </div>

                    <h3 className="dishTitle">{dish.name}</h3>

                    <div className="cardFooter">
                      <div className="priceContainer">
                        <div className="mainPrice">
                          <span className="currency">S/</span>
                          <span className="amount">{numPrice.toFixed(2)}</span>
                        </div>
                        
                        {numOldPrice && numOldPrice > numPrice && (
                          <span className="oldPrice">S/ {numOldPrice.toFixed(2)}</span>
                        )}
                      </div>

                      <button className="addCartBtn" onClick={() => handleAddToCart(dish)}>
                        <FiShoppingCart />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DishesPage;