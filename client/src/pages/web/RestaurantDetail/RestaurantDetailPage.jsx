import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRestaurant, useCart } from "@/context";
import { getImageUrl } from "@/utils/image";
import { 
  FiArrowLeft, 
  FiStar, 
  FiClock, 
  FiHeart, 
  FiSearch, 
  FiShoppingBag,
  FiTruck,
  FiPlus,
  FiCheck
} from "react-icons/fi";
import { FaUtensils, FaHeart } from "react-icons/fa";
import "./RestaurantDetailPage.scss";

const FALLBACK_DISH_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. CONTEXTOS GLOBALES
  const { restaurants = [], loading: loadingRestaurants } = useRestaurant();
  
  const cartContext = useCart();
  const { 
    addToCart, 
    openCart, 
    setIsCartOpen, 
    toggleCart 
  } = cartContext || {};

  // 2. ESTADOS LOCALES
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 3. CARGA Y FILTRADO INTELIGENTE DE PRODUCTOS
  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;
      try {
        setLoadingProducts(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3977/api/v1";
        
        const resWithParam = await fetch(`${API_URL}/products?restaurant=${id}`);
        const data = await resWithParam.json();

        let rawList = [];
        if (Array.isArray(data)) {
          rawList = data;
        } else if (Array.isArray(data.docs)) {
          rawList = data.docs;
        } else if (Array.isArray(data.products)) {
          rawList = data.products;
        } else if (Array.isArray(data.data)) {
          rawList = data.data;
        }

        const targetId = String(id).trim().toLowerCase();

        const currentRest = restaurants.find((r) => String(r._id || r.id).trim().toLowerCase() === targetId);
        const currentUserId = currentRest?.user 
          ? String(typeof currentRest.user === "object" ? currentRest.user._id : currentRest.user).trim().toLowerCase()
          : null;

        const validProducts = rawList.filter((prod) => {
          if (!prod) return false;

          let prodRestId = "";
          if (typeof prod.restaurant === "object" && prod.restaurant !== null) {
            prodRestId = prod.restaurant._id || prod.restaurant.id || "";
          } else if (typeof prod.restaurant === "string") {
            prodRestId = prod.restaurant;
          } else if (prod.restaurantId) {
            prodRestId = prod.restaurantId;
          }

          const cleanProdRestId = String(prodRestId).trim().toLowerCase();

          return cleanProdRestId === targetId || (currentUserId && cleanProdRestId === currentUserId);
        });

        setProducts(validProducts);

      } catch (err) {
        console.error("Error al cargar productos de la API:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [id, restaurants]);

  // 4. FUNCIONES AUXILIARES
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(!isFavorite ? `❤️ Guardado en tus favoritos` : `Eliminado de favoritos`);
  };

  const handleAddToCart = (dish) => {
    const priceNum = typeof dish.price === "number"
      ? dish.price
      : parseFloat(String(dish.price).replace(/[^\d.-]/g, "")) || 0;

    const rawImg = dish.miniature || dish.img || dish.image;
    const finalImg = rawImg ? getImageUrl(rawImg) : FALLBACK_DISH_IMG;

    if (addToCart) {
      addToCart({
        id: dish._id || dish.id,
        name: dish.name,
        price: priceNum,
        image: finalImg,
        restaurant: id
      });
    }

    setCartCount((prev) => prev + 1);
    showToast(`🛒 ${dish.name} añadido al pedido`);
  };

  const handleOpenCartModal = () => {
    if (typeof openCart === "function") {
      openCart();
    } else if (typeof setIsCartOpen === "function") {
      setIsCartOpen(true);
    } else if (typeof toggleCart === "function") {
      toggleCart();
    }
  };

  // 5. RENDERS CONDICIONALES
  if (loadingRestaurants || loadingProducts) {
    return (
      <div className="restaurant-detail-wrapper" style={{ padding: "4rem", textAlign: "center" }}>
        <h2>Cargando información del restaurante y platillos...</h2>
      </div>
    );
  }

  const restaurant = restaurants.find(
    (r) => String(r._id || r.id) === String(id)
  );

  if (!restaurant) {
    return (
      <div className="restaurant-detail-wrapper">
        <div className="restaurant-detail-container">
          <button className="icon-btn back-btn" onClick={() => navigate(-1)} type="button">
            <FiArrowLeft /> <span>Volver</span>
          </button>
          
          <div className="empty-hero-card">
            <div className="empty-illustration">
              <div className="icon-circle">
                <FaUtensils />
              </div>
            </div>

            <div className="empty-content">
              <h3>Restaurante no encontrado</h3>
              <p>Selecciona un restaurante válido desde la lista.</p>
              <button className="primary-btn" onClick={() => navigate(-1)}>
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. CATEGORÍAS Y BÚSQUEDA LOCAL
  const dishes = products;

  const categoriesSet = new Set(["Todos"]);
  dishes.forEach((d) => {
    let catName = "";
    if (typeof d.category === "object" && d.category !== null) {
      catName = d.category.name || d.category.title || "";
    } else if (typeof d.category === "string") {
      catName = d.category;
    }
    if (catName) categoriesSet.add(catName);
  });
  const dynamicCategories = Array.from(categoriesSet);

  const filteredDishes = dishes.filter((dish) => {
    let matchesCategory = true;
    
    if (selectedCategory !== "Todos") {
      const dishCatName = (typeof dish.category === "object" && dish.category !== null)
        ? (dish.category.name || "")
        : String(dish.category || "");

      matchesCategory = dishCatName.toLowerCase() === selectedCategory.toLowerCase();
    }

    const nameStr = String(dish.name || "").toLowerCase();
    const descStr = String(dish.desc || dish.description || "").toLowerCase();
    const searchStr = searchTerm.toLowerCase();

    return matchesCategory && (nameStr.includes(searchStr) || descStr.includes(searchStr));
  });

  const rawRestaurantImg = restaurant.image || restaurant.avatar || restaurant.logo;

  // 7. RENDER PRINCIPAL
  return (
    <div className="restaurant-detail-wrapper">
      <div className="restaurant-detail-container">
        
        {/* CABECERA */}
        <div className="restaurant-header-card">
          <div 
            className="banner-top" 
            style={{ background: restaurant.bannerBg || "linear-gradient(135deg, #FF5E00 0%, #E05200 100%)" }}
          >
            <button className="icon-btn back-btn" onClick={() => navigate(-1)} type="button">
              <FiArrowLeft /> <span>Volver</span>
            </button>

            <div className="banner-actions">
              <button 
                className={`icon-btn action-btn favorite ${isFavorite ? "active" : ""}`} 
                onClick={handleToggleFavorite} 
                type="button" 
                title="Favorito"
              >
                {isFavorite ? <FaHeart color="#ef4444" /> : <FiHeart />}
              </button>
            </div>
          </div>

          <div className="info-bottom">
            <div className="logo-box">
              {rawRestaurantImg ? (
                <img 
                  className="logo-main-img"
                  src={getImageUrl(rawRestaurantImg)} 
                  alt={restaurant.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_DISH_IMG;
                  }}
                />
              ) : (
                <div className="logo-placeholder">
                  <FiShoppingBag />
                  <span>DeliRappi</span>
                </div>
              )}
            </div>

            <div className="details">
              <div className="title-row">
                <h1 className="restaurant-title">{restaurant.name}</h1>
                <span className="badge-promo">PROMO 2x1</span>
              </div>
              
              <div className="tags-row">
                {restaurant.category && <span className="tag-pill category">{restaurant.category}</span>}
                {restaurant.rating !== undefined && (
                  <span className="tag-pill rating">
                    <FiStar className="star-icon" /> {Number(restaurant.rating).toFixed(1)}
                  </span>
                )}
                {(restaurant.deliveryTime || restaurant.estimatedTime) && (
                  <span className="tag-pill time">
                    <FiClock /> {restaurant.deliveryTime || restaurant.estimatedTime}
                  </span>
                )}
                {restaurant.deliveryFee !== undefined && (
                  <span className="tag-pill fee">
                    <FiTruck /> {typeof restaurant.deliveryFee === "number" ? `S/ ${restaurant.deliveryFee.toFixed(2)}` : restaurant.deliveryFee}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="menu-control-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar platillo o ingrediente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="categories-pills">
            {dynamicCategories.map((cat) => (
              <button 
                key={cat} 
                className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LISTADO DE PLATILLOS */}
        <section className="dishes-section">
          <div className="section-header">
            <h2>Platillos Disponibles</h2>
            <span className="count">{filteredDishes.length} opciones</span>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="empty-menu-card">
              <div className="icon-wrapper">
                <FaUtensils />
              </div>
              <h3>No hay platillos disponibles</h3>
              <p>Agrega platillos a este restaurante o cambia los filtros de búsqueda.</p>
            </div>
          ) : (
            <div className="dishes-grid">
              {filteredDishes.map((dish, index) => {
                const dishImgRaw = dish.miniature || dish.img || dish.image;
                const finalDishSrc = dishImgRaw ? getImageUrl(dishImgRaw) : FALLBACK_DISH_IMG;

                return (
                  <div key={dish._id || dish.id || index} className="dish-card">
                    <div className="dish-info">
                      <h4>{dish.name}</h4>
                      <p>{dish.desc || dish.description}</p>
                      <span className="dish-price">
                        {typeof dish.price === "number" ? `S/ ${dish.price.toFixed(2)}` : dish.price}
                      </span>
                    </div>
                    
                    <div className="dish-media">
                      <img 
                        src={finalDishSrc} 
                        alt={dish.name} 
                        onError={(e) => { 
                          e.target.onerror = null;
                          e.target.src = FALLBACK_DISH_IMG; 
                        }}
                      />
                      <button 
                        className="add-btn" 
                        onClick={() => handleAddToCart(dish)}
                        type="button"
                        title="Agregar al carrito"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* TOAST NOTIFICACIÓN */}
      {toastMessage && (
        <div className="custom-toast">
          <FiCheck className="check-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* BARRA FLOTANTE DEL CARRITO */}
      {cartCount > 0 && (
        <div className="floating-cart-bar" style={{ cursor: "pointer" }} onClick={handleOpenCartModal}>
          <div className="cart-info">
            <span className="badge">{cartCount}</span>
            <span>Ver tu pedido</span>
          </div>
          <button className="checkout-btn" onClick={(e) => { e.stopPropagation(); handleOpenCartModal(); }}>
            Ir a Pagar
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;