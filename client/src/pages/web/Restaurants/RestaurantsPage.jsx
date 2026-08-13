import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiSliders, 
  FiStar, 
  FiClock, 
  FiTruck, 
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCheck
} from "react-icons/fi";
import { FaUtensils, FaHeart } from "react-icons/fa";
import { useRestaurant } from "@/context";
import { getImageUrl } from "@/utils/image";
import "./RestaurantsPage.scss";

const RESTAURANT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80"
];

const RESTAURANT_CATEGORIES = [
  { id: "Todos", label: "Todos", icon: "🍽️", keywords: [] },
  { id: "Pollo a la Brasa", label: "Pollo a la Brasa", icon: "🍗", keywords: ["pollo", "brasa", "polleria", "pollería"] },
  { id: "Hamburguesas", label: "Hamburguesas", icon: "🍔", keywords: ["hamburguesa", "burger", "fast food"] },
  { id: "Pizza", label: "Pizzería", icon: "🍕", keywords: ["pizza", "pizzeria", "pizzería", "italiana"] },
  { id: "Chifa & Chino", label: "Chifa & Chino", icon: "🥡", keywords: ["chifa", "chino", "asian"] },
  { id: "Mariscos & Ceviche", label: "Mariscos & Ceviche", icon: "🐟", keywords: ["mariscos", "ceviche", "cewicheria", "cevichería"] },
  { id: "Tacos & Mexicana", label: "Mexicana & Tacos", icon: "🌮", keywords: ["tacos", "mexicana", "burritos"] },
  { id: "Sushi & Asiática", label: "Sushi & Asiática", icon: "🍣", keywords: ["sushi", "asiatica", "asiática", "ramen"] },
  { id: "Criolla & Peruana", label: "Criolla & Peruana", icon: "🍲", keywords: ["criolla", "peruana", "menu"] },
  { id: "Postres & Dulces", label: "Postres & Dulces", icon: "🍰", keywords: ["postres", "dulces", "helados", "bakery"] },
  { id: "Bebidas & Cafés", label: "Bebidas & Cafés", icon: "🥤", keywords: ["bebidas", "cafe", "café", "jugos"] }
];

const normalizeText = (text = "") => {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

export const RestaurantsPage = ({ restaurantsList }) => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const contextData = useRestaurant();
  const contextRestaurants = contextData?.restaurants || [];
  const contextLoading = contextData?.loading || false;

  const [fetchedRestaurants, setFetchedRestaurants] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("rating"); 
  const [favorites, setFavorites] = useState([]);
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    if (!restaurantsList && contextRestaurants.length === 0) {
      const fetchDirect = async () => {
        try {
          setLoadingLocal(true);
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3977/api/v1";
          const res = await fetch(`${API_URL}/restaurants`);
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.restaurants || data.docs || []);
          setFetchedRestaurants(list);
        } catch (err) {
          console.error("Error al cargar restaurantes:", err);
        } finally {
          setLoadingLocal(false);
        }
      };
      fetchDirect();
    }
  }, [restaurantsList, contextRestaurants.length]);

  const rawList = restaurantsList || (contextRestaurants.length > 0 ? contextRestaurants : fetchedRestaurants);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 280;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim() !== "" && selectedCategory !== "Todos") {
      setSelectedCategory("Todos");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setOnlyFreeDelivery(false);
    setMinRating(0);
    setSortBy("popular");
    setIsFilterModalOpen(false);
  };

  const filteredRestaurants = (rawList || [])
    .filter((resto) => {
      if (!resto) return false;

      const normalizedSearch = normalizeText(searchTerm);
      const restoName = normalizeText(resto.name);
      const restoCat = normalizeText(resto.category);

      let matchesSearch = true;
      if (normalizedSearch !== "") {
        const matchesName = restoName.includes(normalizedSearch);
        const matchesCategoryText = restoCat.includes(normalizedSearch);
        const matchesTags = resto.tags 
          ? resto.tags.some(tag => normalizeText(tag).includes(normalizedSearch))
          : false;

        matchesSearch = matchesName || matchesCategoryText || matchesTags;
      }

      let matchesCategory = true;
      if (normalizedSearch === "" && selectedCategory !== "Todos") {
        const categoryObj = RESTAURANT_CATEGORIES.find(c => c.id === selectedCategory);
        const isDirectCat = restoCat.includes(normalizeText(selectedCategory));
        const isKeywordCat = categoryObj?.keywords?.some(kw => 
          restoCat.includes(normalizeText(kw)) || restoName.includes(normalizeText(kw))
        );
        matchesCategory = isDirectCat || isKeywordCat;
      }

      let matchesFreeDelivery = true;
      if (onlyFreeDelivery) {
        const fee = resto.deliveryFee;
        matchesFreeDelivery = fee === 0 || fee === "Gratis" || fee === "0";
      }

      let matchesMinRating = true;
      if (minRating > 0) {
        matchesMinRating = (resto.rating || 0) >= minRating;
      }

      return matchesSearch && matchesCategory && matchesFreeDelivery && matchesMinRating;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "popular") return (b.reviewsCount || b.reviews || 0) - (a.reviewsCount || a.reviews || 0);
      return 0;
    });

  const isLoading = contextLoading || loadingLocal;

  return (
    <div className="restaurants-page-wrapper">
      <div className="restaurants-container">
        
        <header className="page-header">
          <div className="title-area">
            <h1>Gestión de Restaurantes</h1>
            <p>
              Explora y administra los locales aliados{" "}
              <span className="count-badge">({filteredRestaurants.length} disponibles)</span>
            </p>
          </div>
        </header>

        <div className="controls-bar">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por restaurante o tipo de comida..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch} title="Limpiar búsqueda">
                <FiX />
              </button>
            )}
          </div>

          <div className="filters-right">
            <div className="select-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Más populares</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>

            <button 
              className={`btn-filter-modal ${onlyFreeDelivery || minRating > 0 ? "active" : ""}`} 
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <FiSliders /> <span>Filtros</span>
              {(onlyFreeDelivery || minRating > 0) && <span className="active-dot"></span>}
            </button>
          </div>
        </div>

        <div className="categories-carousel-wrapper">
          <button 
            className="carousel-btn btn-left" 
            onClick={() => handleScroll("left")}
            aria-label="Anterior"
            type="button"
          >
            <FiChevronLeft />
          </button>

          <nav className="categories-scroll-bar" ref={carouselRef}>
            {RESTAURANT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchTerm("");
                }}
                type="button"
              >
                <span className="icon">{cat.icon}</span>
                <span className="label">{cat.label}</span>
              </button>
            ))}
          </nav>

          <button 
            className="carousel-btn btn-right" 
            onClick={() => handleScroll("right")}
            aria-label="Siguiente"
            type="button"
          >
            <FiChevronRight />
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <h3>Cargando restaurantes...</h3>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="empty-restaurants-card">
            <div className="empty-illustration">
              <div className="icon-circle">
                <FaUtensils />
              </div>
            </div>

            <div className="empty-content">
              <h3>No encontramos restaurantes</h3>
              <p>
                {searchTerm
                  ? `No hay resultados para "${searchTerm}". Prueba con otro término.`
                  : selectedCategory !== "Todos"
                  ? `No hay locales en la categoría "${selectedCategory}". Intenta con otra.`
                  : "No hay locales que coincidan con los filtros aplicados."}
              </p>
              {(searchTerm || selectedCategory !== "Todos" || onlyFreeDelivery || minRating > 0) && (
                <button className="reset-btn" onClick={resetAllFilters}>
                  Restablecer filtros
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map((resto, index) => {
              const restoId = resto._id || resto.id;
              const isFav = favorites.includes(restoId);
              
              const rawImg = resto.image || resto.avatar || resto.logo;
              const hasValidImg = rawImg && !rawImg.includes("via.placeholder") && !rawImg.includes("undefined");
              
              const finalImg = hasValidImg 
                ? (getImageUrl ? getImageUrl(rawImg) : rawImg) 
                : RESTAURANT_FALLBACK_IMAGES[index % RESTAURANT_FALLBACK_IMAGES.length];

              return (
                <article
                  key={restoId || index}
                  className="restaurant-card"
                  onClick={() => navigate(`/restaurants/${restoId}`)}
                >
                  <div className="card-media">
                    <img src={finalImg} alt="" className="bg-blur" aria-hidden="true" />
                    <img 
                      src={finalImg} 
                      alt={resto.name || "Restaurante"} 
                      className="main-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = RESTAURANT_FALLBACK_IMAGES[index % RESTAURANT_FALLBACK_IMAGES.length];
                      }}
                    />
                    
                    {resto.tag && <span className="badge-tag">{resto.tag}</span>}

                    <button
                      className={`fav-btn ${isFav ? "active" : ""}`}
                      onClick={(e) => toggleFavorite(restoId, e)}
                      type="button"
                      title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                      {isFav ? <FaHeart color="#ef4444" /> : <FiHeart />}
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="name-row">
                      <h4>{resto.name}</h4>
                      <span className="rating">
                        <FiStar className="star" /> {resto.rating !== undefined ? Number(resto.rating).toFixed(1) : "4.8"}
                      </span>
                    </div>

                    <p className="category-text">{resto.category || "General"}</p>

                    <div className="info-footer">
                      <span className="time">
                        <FiClock /> {resto.deliveryTime || resto.estimatedTime || "25-35 min"}
                      </span>
                      <span className="fee">
                        <FiTruck /> {resto.deliveryFee !== undefined ? (typeof resto.deliveryFee === 'number' && resto.deliveryFee > 0 ? `S/ ${resto.deliveryFee.toFixed(2)}` : resto.deliveryFee === 0 ? "Gratis" : resto.deliveryFee) : "Gratis"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {isFilterModalOpen && (
          <div className="modal-overlay" onClick={() => setIsFilterModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Filtros Avanzados</h3>
                <button className="close-btn" onClick={() => setIsFilterModalOpen(false)}>
                  <FiX />
                </button>
              </div>

              <div className="modal-body">
                <div className="filter-option" onClick={() => setOnlyFreeDelivery(!onlyFreeDelivery)}>
                  <div>
                    <span className="option-title">Delivery Gratis</span>
                    <p className="option-sub">Mostrar solo locales con envío gratuito</p>
                  </div>
                  <div className={`checkbox-custom ${onlyFreeDelivery ? "checked" : ""}`}>
                    {onlyFreeDelivery && <FiCheck />}
                  </div>
                </div>

                <div className="filter-group">
                  <span className="option-title">Calificación Mínima</span>
                  <div className="rating-options">
                    {[0, 4.0, 4.5].map((val) => (
                      <button
                        key={val}
                        className={`rating-btn ${minRating === val ? "active" : ""}`}
                        onClick={() => setMinRating(val)}
                      >
                        {val === 0 ? "Todos" : `${val}+ ⭐`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={resetAllFilters}>
                  Limpiar todo
                </button>
                <button className="btn-primary" onClick={() => setIsFilterModalOpen(false)}>
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RestaurantsPage;