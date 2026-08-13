import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurant, useCart } from "@/context";
import { getImageUrl } from "@/utils";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiSearch, 
  FiClock, 
  FiTruck, 
  FiMapPin, 
  FiStar,
  FiZap,
  FiAward,
  FiX,
  FiPlus,
  FiChevronRight as ArrowIcon 
} from "react-icons/fi";
import "./HomePage.scss";

const BANNER_SLIDES = [
  {
    id: 1,
    tag: "ESPECIALES DE LA SEMANA",
    title: "Promociones y Descuentos Exclusivos",
    description: "Obtén hasta un 30% OFF en combos seleccionados de alta cocina.",
    buttonText: "Ver Ofertas",
    categoryFilter: "Todos",
    bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    tag: "ENVÍOS GRATIS",
    title: "Tus Hamburguesas Favoritas",
    description: "Pide en restaurantes seleccionados y el envío corre por nuestra cuenta.",
    buttonText: "Pedir Ahora",
    categoryFilter: "Hamburguesas",
    bgImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    tag: "NOCHES DE PIZZA",
    title: "2x1 En Pizzas Familiares",
    description: "Disfruta de la mejor masa artesanal en la comodidad de tu hogar.",
    buttonText: "Aprovechar 2x1",
    categoryFilter: "Pizza",
    bgImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  },
];

const RESTAURANT_CATEGORIES = [
  { id: "Todos", label: "Todos", icon: "🍽️", keywords: [] },
  { id: "Pollo a la Brasa", label: "Pollo a la Brasa", icon: "🍗", keywords: ["pollo", "brasa", "polleria", "pollería"] },
  { id: "Hamburguesas", label: "Hamburguesas", icon: "🍔", keywords: ["hamburguesa", "burger", "fast food"] },
  { id: "Pizza", label: "Pizzería", icon: "🍕", keywords: ["pizza", "pizzeria", "pizzería", "italiana"] },
  { id: "Chifa & Chino", label: "Chifa & Chino", icon: "🍱", keywords: ["chifa", "chino", "asian"] },
  { id: "Mariscos & Ceviche", label: "Mariscos & Ceviche", icon: "🐟", keywords: ["mariscos", "ceviche", "cewicheria", "cevichería"] },
  { id: "Tacos & Mexicana", label: "Mexicana & Tacos", icon: "🌮", keywords: ["tacos", "mexicana", "burritos"] },
  { id: "Sushi & Asiática", label: "Sushi & Asiática", icon: "🍣", keywords: ["sushi", "asiatica", "asiática", "ramen"] },
  { id: "Criolla & Peruana", label: "Criolla & Peruana", icon: "🍲", keywords: ["criolla", "peruana", "menu"] },
  { id: "Postres & Dulces", label: "Postres & Dulces", icon: "🍰", keywords: ["postres", "dulces", "helados", "bakery"] },
  { id: "Bebidas & Cafés", label: "Bebidas & Cafés", icon: "🥤", keywords: ["bebidas", "cafe", "café", "jugos"] }
];

const QUICK_DISHES = [
  { 
    id: "qd-1", 
    name: "Pizza Pepperoni Familiar", 
    price: "S/ 35.90", 
    oldPrice: "S/ 45.00", 
    tag: "2x1", 
    rating: 4.9, 
    category: "Pizza",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-2", 
    name: "Combo Double Bacon Burger", 
    price: "S/ 24.50", 
    oldPrice: "S/ 32.00", 
    tag: "Envío gratis", 
    rating: 4.8, 
    category: "Hamburguesas",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-3", 
    name: "Roll Acevichado (12 pcs)", 
    price: "S/ 29.90", 
    oldPrice: "S/ 38.00", 
    tag: "-25% OFF", 
    rating: 4.9, 
    category: "Sushi & Asiática",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-4", 
    name: "Lasagna Bolognesa Artesanal", 
    price: "S/ 28.00", 
    oldPrice: "S/ 34.00", 
    tag: "Popular", 
    rating: 4.7, 
    category: "Pizza",
    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-5", 
    name: "1/4 Pollo a la Brasa + Papas", 
    price: "S/ 21.90", 
    oldPrice: "S/ 27.00", 
    tag: "Top Ventas", 
    rating: 4.9, 
    category: "Pollo a la Brasa",
    img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-6", 
    name: "Tacos al Pastor Especiales (3u)", 
    price: "S/ 22.00", 
    oldPrice: "S/ 28.00", 
    tag: "-20% OFF", 
    rating: 4.8, 
    category: "Tacos & Mexicana",
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-7", 
    name: "Ceviche Mixto Tradicional", 
    price: "S/ 32.50", 
    oldPrice: "S/ 40.00", 
    tag: "Fresco", 
    rating: 4.9, 
    category: "Mariscos & Ceviche",
    img: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-8", 
    name: "Alitas BBQ Crunch (8u)", 
    price: "S/ 23.90", 
    oldPrice: "S/ 30.00", 
    tag: "Crunch", 
    rating: 4.8, 
    category: "Hamburguesas",
    img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-9", 
    name: "Cheesecake de Frutos Rojos", 
    price: "S/ 16.50", 
    oldPrice: "S/ 21.00", 
    tag: "Postre", 
    rating: 4.9, 
    category: "Postres & Dulces",
    img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "qd-10", 
    name: "Milkshake de Chocolate Belga", 
    price: "S/ 15.00", 
    oldPrice: "", 
    tag: "Frozen", 
    rating: 4.8, 
    category: "Bebidas & Cafés",
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80" 
  }
];

const FALLBACK_RESTAURANT_IMG = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80";

export const HomePage = () => {
  const navigate = useNavigate();
  const { restaurants, loading } = useRestaurant();
  const { addToCart } = useCart();
  const categoriesRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSelectRestaurant = (id) => {
    if (id) navigate(`/restaurants/${id}`);
  };

  const scrollToRestaurants = () => {
    const targetSection = document.getElementById("restaurants-list");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDishClick = (dish) => {
    setSearchQuery("");
    setSelectedCategory(dish.category);
    scrollToRestaurants();
  };

  const handleBannerButtonClick = (category) => {
    if (category) setSelectedCategory(category);
    scrollToRestaurants();
  };

  const handleImageError = (e) => {
    e.currentTarget.src = FALLBACK_RESTAURANT_IMG;
  };

  const handleAddToCart = (e, dish) => {
    e.stopPropagation();
    
    // Limpieza robusta de precio (admite comas y símbolos de moneda)
    const cleanPrice = dish.price.replace(",", ".").replace(/[^\d.-]/g, "");
    const numericPrice = parseFloat(cleanPrice) || 0;

    const itemToAdd = {
      id: dish.id,
      name: dish.name,
      price: numericPrice,
      image: dish.img,
      quantity: 1
    };

    if (typeof addToCart === "function") {
      addToCart(itemToAdd);
    }
  };

  // FILTRADO INTELIGENTE
  const filteredRestaurants = (restaurants || []).filter((rest) => {
    const query = searchQuery.toLowerCase().trim();
    const restName = rest.name?.toLowerCase() || "";
    const restCat = rest.category?.toLowerCase() || "";

    // 1. Buscador de texto
    const matchesSearch = !query || restName.includes(query) || restCat.includes(query);

    // 2. Filtro de Categorías
    let matchesCategory = true;
    if (selectedCategory !== "Todos") {
      const activeCategoryObj = RESTAURANT_CATEGORIES.find((cat) => cat.id === selectedCategory);
      
      if (activeCategoryObj) {
        const keywords = activeCategoryObj.keywords || [];
        const isDirectMatch = restCat === selectedCategory.toLowerCase();
        const isIdMatch = restCat === activeCategoryObj.id.toLowerCase();
        const matchesKeyword = keywords.some((kw) => restCat.includes(kw) || restName.includes(kw));

        matchesCategory = isDirectMatch || isIdMatch || matchesKeyword;
      }
    }

    // 3. Filtros adicionales
    let matchesFilter = true;
    if (activeFilter === "freeDelivery") {
      const feeString = String(rest.deliveryFee ?? "").toLowerCase().trim();
      
      matchesFilter = 
        !rest.deliveryFee || 
        rest.deliveryFee === 0 || 
        feeString === "0" || 
        feeString === "0.00" || 
        feeString === "false" ||
        feeString.includes("gratis");
    }

    if (activeFilter === "topRated") {
      matchesFilter = (parseFloat(rest.rating) || 4.8) >= 4.5;
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="homeContainer">
      {/* 1. HERO BANNER CAROUSEL */}
      <section className="banner-carousel">
        <div 
          className="slide-card" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(15, 12, 29, 0.55), rgba(15, 12, 29, 0.75)), url(${BANNER_SLIDES[currentSlide].bgImage})` 
          }}
        >
          <button className="nav-btn prev" onClick={prevSlide} type="button" aria-label="Anterior">
            <FiChevronLeft />
          </button>
          <button className="nav-btn next" onClick={nextSlide} type="button" aria-label="Siguiente">
            <FiChevronRight />
          </button>

          <div className="slide-content">
            <span className="badge-tag">{BANNER_SLIDES[currentSlide].tag}</span>
            <h1>{BANNER_SLIDES[currentSlide].title}</h1>
            <p>{BANNER_SLIDES[currentSlide].description}</p>
            <button 
              className="btn-action" 
              type="button"
              onClick={() => handleBannerButtonClick(BANNER_SLIDES[currentSlide].categoryFilter)}
            >
              {BANNER_SLIDES[currentSlide].buttonText}
            </button>
          </div>

          <div className="carousel-dots">
            {BANNER_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. BUSCADOR Y CATEGORÍAS */}
      <section className="search-filter-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar tu restaurante o comida favorita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")} type="button" aria-label="Limpiar búsqueda">
              <FiX />
            </button>
          )}
        </div>

        <div className="categories-wrapper">
          <button 
            className="scroll-arrow left" 
            onClick={() => scrollCategories("left")}
            type="button"
            aria-label="Ver categorías anteriores"
          >
            <FiChevronLeft />
          </button>

          <div className="categories-list" ref={categoriesRef}>
            {RESTAURANT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <button 
            className="scroll-arrow right" 
            onClick={() => scrollCategories("right")}
            type="button"
            aria-label="Ver más categorías"
          >
            <FiChevronRight />
          </button>
        </div>
      </section>

      {/* 3. FILTROS RÁPIDOS */}
      <section className="quick-filters-bar" id="restaurants-list">
        <button 
          type="button"
          className={`filter-chip ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          <FiZap /> Todos
        </button>
        <button 
          type="button"
          className={`filter-chip ${activeFilter === "freeDelivery" ? "active" : ""}`}
          onClick={() => setActiveFilter("freeDelivery")}
        >
          <FiTruck /> Envío Gratis
        </button>
        <button 
          type="button"
          className={`filter-chip ${activeFilter === "topRated" ? "active" : ""}`}
          onClick={() => setActiveFilter("topRated")}
        >
          <FiAward /> Mejor Valorados (4.5+)
        </button>
      </section>

      {/* 4. GRILLA DE RESTAURANTES */}
      <section className="restaurants-section">
        <div className="section-header">
          <h2>Restaurantes Disponibles</h2>
          <span>{filteredRestaurants.length} locales cerca de ti</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando restaurantes desde la base de datos...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron restaurantes con esos filtros.</p>
            <button 
              type="button"
              className="reset-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
                setActiveFilter("all");
              }}
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant, idx) => {
              const rawImage = restaurant.image || restaurant.avatar || restaurant.logo;
              const imageUrl = rawImage ? getImageUrl(rawImage) : FALLBACK_RESTAURANT_IMG;
              const restId = restaurant._id || restaurant.id || `rest-${idx}`;

              return (
                <div 
                  key={restId} 
                  className="restaurant-card"
                  onClick={() => handleSelectRestaurant(restId)}
                >
                  <div className="card-image-wrapper">
                    <img className="bg-blur" src={imageUrl} alt="" aria-hidden="true" />
                    <img 
                      className="main-img" 
                      src={imageUrl} 
                      alt={restaurant.name || "Restaurante"} 
                      onError={handleImageError}
                    />

                    <span className={`status-badge ${restaurant.active !== false ? "open" : "closed"}`}>
                      {restaurant.active !== false ? "Abierto" : "Cerrado"}
                    </span>

                    {restaurant.category && (
                      <span className="category-tag">{restaurant.category}</span>
                    )}
                  </div>

                  <div className="card-body">
                    <div className="title-rating-row">
                      <h3>{restaurant.name}</h3>
                      <div className="rating-badge">
                        <FiStar /> <span>{restaurant.rating || "4.8"}</span>
                      </div>
                    </div>

                    <p className="description">
                      {restaurant.description || "Las mejores especialidades preparadas al instante."}
                    </p>

                    <div className="details-info">
                      {restaurant.address && (
                        <div className="info-item">
                          <FiMapPin /> <span>{restaurant.address}</span>
                        </div>
                      )}
                      <div className="flex-row">
                        <div className="info-item">
                          <FiClock /> <span>{restaurant.deliveryTime || "25-35 min"}</span>
                        </div>
                        <div className="info-item price">
                          <FiTruck /> <span>Envío: {restaurant.deliveryFee ? `S/ ${restaurant.deliveryFee}` : "Gratis"}</span>
                        </div>
                      </div>
                    </div>

                    <button className="view-menu-btn" type="button">
                      <span>Ver Menú / Platillos</span>
                      <ArrowIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. ANTOJOS RÁPIDOS */}
      <section className="quick-dishes-section">
        <div className="section-title">
          <div>
            <h3>🔥 Antojos Rápidos</h3>
            <p>Los platillos más pedidos con descuento express</p>
          </div>
        </div>

        <div className="dishes-carousel">
          {QUICK_DISHES.map((dish) => (
            <div 
              key={dish.id} 
              className="quick-dish-card"
              onClick={() => handleDishClick(dish)}
              title={`Ver categoría ${dish.category}`}
            >
              <div className="img-box">
                <img 
                  src={dish.img} 
                  alt={dish.name} 
                  onError={handleImageError}
                />
                <span className="tag-promo">{dish.tag}</span>
                
                <button 
                  type="button" 
                  className="add-to-cart-btn-img"
                  onClick={(e) => handleAddToCart(e, dish)}
                  title="Agregar al carrito"
                  aria-label="Agregar al carrito"
                >
                  <FiPlus />
                </button>
              </div>

              <div className="info">
                <h4>{dish.name}</h4>
                <div className="rating">
                  <FiStar className="star" /> <span>{dish.rating}</span>
                </div>
                <div className="prices-row">
                  <div className="prices">
                    <span className="current-price">{dish.price}</span>
                    {dish.oldPrice && <span className="old-price">{dish.oldPrice}</span>}
                  </div>

                  <button 
                    type="button" 
                    className="add-btn-small" 
                    onClick={(e) => handleAddToCart(e, dish)}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BANNER FOOTER */}
      <section className="promo-footer-banner">
        <div className="promo-content">
          <div className="text">
            <h3>¿Tienes un restaurante?</h3>
            <p>Súmate a nuestra red y multiplica tus ventas hoy mismo.</p>
          </div>
          <button type="button" onClick={() => navigate("/restaurant/login")}>
            Registrar mi Local
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;