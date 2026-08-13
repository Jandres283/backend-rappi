import { useState, useEffect } from "react";
import { 
  LuStore, 
  LuUtensils, 
  LuSearch, 
  LuMapPin, 
  LuPhone, 
  LuClock, 
  LuDollarSign, 
  LuX,
  LuLoader,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuPower
} from "react-icons/lu";
import api from "@/api/axios";
import { ENV } from "@/utils";
import './RestaurantsPage.scss';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  let cleanPath = imagePath.replace(/\\/g, "/");
  if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
  if (!cleanPath.startsWith("uploads/")) cleanPath = `uploads/${cleanPath}`;
  
  const serverBase = ENV.BASE_PATH || "http://localhost:3977";
  return `${serverBase}/${cleanPath}`;
};

export const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [refresh, setRefresh] = useState(0);
  const reloadData = () => setRefresh((prev) => prev + 1);

  // Modales
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(false);

  // Formulario CRUD
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResto, setEditingResto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Pizzeria",
    address: "",
    phone: "",
    estimatedTime: "20-30 min",
    deliveryFee: 0,
    isOpen: true
  });
  const [imageFile, setImageFile] = useState(null);

  // Cargar lista de restaurantes desde la API
  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        // Intenta primero con '/restaurants', si falla prueba '/restaurant'
        let res;
        try {
          res = await api.get('/restaurants?limit=50');
        } catch {
          res = await api.get('/restaurant?limit=50');
        }
        
        if (isMounted) {
          setRestaurants(res.data.docs || res.data || []);
        }
      } catch (err) {
        console.error("Error al cargar restaurantes:", err);
        if (isMounted) {
          setErrorMessage(err.response?.data?.message || "No se pudo conectar con el servidor backend.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, [refresh]);

  // Cargar platillos
  const handleOpenMenu = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoadingDishes(true);
    setDishes([]);
    try {
      const restoId = restaurant._id;
      const userId = restaurant.user?._id || restaurant.user;

      let res = await api.get(`/products?restaurant=${restoId}`);
      let docs = res.data.docs || res.data || [];

      if ((!docs || docs.length === 0) && userId) {
        res = await api.get(`/products?restaurant=${userId}`);
        docs = res.data.docs || res.data || [];
      }

      setDishes(docs);
    } catch (err) {
      console.error("Error al obtener platillos:", err);
    } finally {
      setLoadingDishes(false);
    }
  };

  // Acciones CRUD
  const handleOpenForm = (resto = null) => {
    if (resto) {
      setEditingResto(resto);
      setFormData({
        name: resto.name || "",
        description: resto.description || "",
        category: resto.category || "Pizzeria",
        address: resto.address || "",
        phone: resto.phone || "",
        estimatedTime: resto.estimatedTime || "20-30 min",
        deliveryFee: resto.deliveryFee || 0,
        isOpen: resto.isOpen ?? true
      });
    } else {
      setEditingResto(null);
      setFormData({
        name: "",
        description: "",
        category: "Pizzeria",
        address: "",
        phone: "",
        estimatedTime: "20-30 min",
        deliveryFee: 0,
        isOpen: true
      });
    }
    setImageFile(null);
    setIsFormOpen(true);
  };

  // Guardar / Editar Restaurante
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.keys(formData).forEach((key) => body.append(key, formData[key]));
    if (imageFile) body.append("image", imageFile);

    try {
      if (editingResto) {
        // Intenta actualizar por ID en singular
        try {
          await api.patch(`/restaurant/${editingResto._id}`, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch {
          await api.patch(`/restaurants/${editingResto._id}`, body, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Crear nuevo restaurante
        try {
          await api.post('/restaurant', body, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch {
          await api.post('/restaurants', body, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }
      setIsFormOpen(false);
      setImageFile(null);
      reloadData();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar en la base de datos.");
    }
  };

  // Eliminar Restaurante (Resuelve el error 404 del DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este restaurante?")) return;
    try {
      try {
        await api.delete(`/restaurant/${id}`);
      } catch {
        await api.delete(`/restaurants/${id}`);
      }
      reloadData();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el restaurante.");
    }
  };

  // Cambiar Estado (Abierto / Cerrado)
  const handleToggleStatus = async (resto) => {
    try {
      try {
        await api.patch(`/restaurant/${resto._id}`, { isOpen: !resto.isOpen });
      } catch {
        await api.patch(`/restaurants/${resto._id}`, { isOpen: !resto.isOpen });
      }
      reloadData();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const filteredRestaurants = restaurants.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true :
                          statusFilter === "open" ? item.isOpen : !item.isOpen;
    return matchesSearch && matchesStatus;
  });

  const fallbackImg = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="restaurants-page">
      <header className="page-header">
        <div className="header-info">
          <div className="title-row">
            <LuStore className="header-icon" />
            <h1>Gestión de Restaurantes Aliados</h1>
          </div>
          <p>Supervisa, crea, edita o elimina establecimientos y menús en tiempo real.</p>
        </div>
        <div className="header-actions">
          <div className="header-badge">
            <span className="dot"></span> Panel Activo
          </div>
          <button className="btn-create cursor-pointer" onClick={() => handleOpenForm()}>
            <LuPlus /> Nuevo Restaurante
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="search-box">
          <LuSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos los estados</option>
          <option value="open">🟢 Abiertos</option>
          <option value="closed">🔴 Cerrados</option>
        </select>
      </div>

      {loading ? (
        <div className="state-container">
          <LuLoader className="spinner" />
          <p>Cargando datos desde la API...</p>
        </div>
      ) : errorMessage ? (
        <div className="state-container error">
          <LuX className="empty-icon" style={{ color: '#ef4444' }} />
          <h3>Error de Conexión</h3>
          <p>{errorMessage}</p>
          <button onClick={reloadData} className="btn-create" style={{ marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="state-container empty">
          <LuStore className="empty-icon" />
          <h3>No hay restaurantes disponibles</h3>
          <p>Crea tu primer restaurante con el botón de arriba.</p>
        </div>
      ) : (
        <div className="restaurants-grid">
          {filteredRestaurants.map((resto) => {
            const finalImgUrl = getImageUrl(resto.image) || fallbackImg;

            return (
              <div key={resto._id} className={`restaurant-card ${!resto.isOpen ? 'closed' : ''}`}>
                <div className="card-banner">
                  <img src={finalImgUrl} alt="" className="bg-blur" />
                  <img 
                    src={finalImgUrl} 
                    alt={resto.name} 
                    className="main-img" 
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                  />

                  <span className={`status-badge ${resto.isOpen ? 'open' : 'closed'}`}>
                    {resto.isOpen ? 'Abierto' : 'Cerrado'}
                  </span>
                  <span className="category-tag">{resto.category}</span>

                  <div className="card-actions">
                    <button className="action-btn toggle" onClick={() => handleToggleStatus(resto)}>
                      <LuPower />
                    </button>
                    <button className="action-btn edit" onClick={() => handleOpenForm(resto)}>
                      <LuPencil />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(resto._id)}>
                      <LuTrash2 />
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="restaurant-title">{resto.name}</h3>
                  <p className="description">{resto.description || 'Sin descripción disponible.'}</p>

                  <div className="details-list">
                    <div className="detail-item">
                      <LuMapPin className="icon" />
                      <span>{resto.address}</span>
                    </div>
                    {resto.phone && (
                      <div className="detail-item">
                        <LuPhone className="icon" />
                        <span>{resto.phone}</span>
                      </div>
                    )}
                    <div className="detail-item-group">
                      <div className="detail-item">
                        <LuClock className="icon" />
                        <span>{resto.estimatedTime || '20-30 min'}</span>
                      </div>
                      <div className="detail-item">
                        <LuDollarSign className="icon" />
                        <span>Envío: S/ {Number(resto.deliveryFee || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn-menu cursor-pointer" onClick={() => handleOpenMenu(resto)}>
                    <LuUtensils />
                    <span>Ver Menú / Platillos</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORMULARIO MODAL */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-container form-modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>{editingResto ? "Editar Restaurante" : "Nuevo Restaurante"}</h2>
              <button className="close-btn" onClick={() => setIsFormOpen(false)}><LuX /></button>
            </header>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-grid">
                <div className="field">
                  <label>Nombre del Restaurante</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="field">
                  <label>Categoría</label>
                  <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="field full">
                  <label>Dirección</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="field">
                  <label>Tiempo Estimado</label>
                  <input type="text" value={formData.estimatedTime} onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})} />
                </div>
                <div className="field">
                  <label>Costo de Envío (S/)</label>
                  <input type="number" step="0.10" value={formData.deliveryFee} onChange={(e) => setFormData({...formData, deliveryFee: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="field">
                  <label>Imagen Portada</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
                <div className="field full">
                  <label>Descripción</label>
                  <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar Restaurante</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER MENÚ */}
      {selectedRestaurant && (
        <div className="modal-overlay" onClick={() => setSelectedRestaurant(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div>
                <h2>Menú de {selectedRestaurant.name}</h2>
                <span className="sub-tag">{selectedRestaurant.category}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedRestaurant(null)}><LuX /></button>
            </header>
            <div className="modal-body">
              {loadingDishes ? (
                <div className="state-container"><LuLoader className="spinner" /><p>Cargando menú...</p></div>
              ) : dishes.length === 0 ? (
                <div className="state-container empty"><h4>Sin platillos registrados.</h4></div>
              ) : (
                <div className="dishes-modal-grid">
                  {dishes.map((dish) => {
                    const dishImg = getImageUrl(dish.miniature || dish.image) || fallbackImg;
                    return (
                      <div key={dish._id} className="dish-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        <img 
                          src={dishImg} 
                          alt={dish.name} 
                          style={{ width: '65px', height: '65px', borderRadius: '8px', objectFit: 'cover' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                        />
                        <div className="dish-info" style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{dish.name}</h4>
                          <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#666' }}>{dish.description || 'Sin detalles'}</p>
                          <span className="price" style={{ fontWeight: 'bold', color: '#e11d48' }}>
                            S/ {Number(dish.price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;