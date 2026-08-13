import { useState, useEffect } from "react";
import { 
  LuUtensils, 
  LuSearch, 
  LuPlus, 
  LuPencil, 
  LuTrash2, 
  LuLoader, 
  LuX,
  LuStore
} from "react-icons/lu";
import api from "@/api/axios";
import { ENV } from "@/utils";
import "./ProductsPage.scss";

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  let cleanPath = imagePath.replace(/\\/g, "/");
  if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
  if (!cleanPath.startsWith("uploads/")) cleanPath = `uploads/${cleanPath}`;
  
  const serverBase = ENV.BASE_PATH || "http://localhost:3977";
  return `${serverBase}/${cleanPath}`;
};

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");

  const [refresh, setRefresh] = useState(0);
  const reloadData = () => setRefresh((prev) => prev + 1);

  // Modal CRUD
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    restaurant: "",
    active: true
  });
  const [imageFile, setImageFile] = useState(null);

  // 1. Cargar productos y restaurantes
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const [prodRes, restoRes] = await Promise.all([
          api.get("/products?limit=100"),
          api.get("/restaurants?limit=100")
        ]);

        if (isMounted) {
          setProducts(prodRes.data.docs || prodRes.data || []);
          setRestaurants(restoRes.data.docs || restoRes.data || []);
        }
      } catch (error) {
        console.error("Error al cargar datos de productos:", error);
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "No se pudieron consultar los productos en el servidor."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [refresh]);

  // 2. Controladores del Formulario Modal
  const handleOpenForm = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        name: prod.name || "",
        description: prod.description || "",
        price: prod.price || 0,
        category: prod.category || "",
        restaurant: prod.restaurant?._id || prod.restaurant || "",
        active: prod.active ?? true
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        restaurant: restaurants[0]?._id || "",
        active: true
      });
    }
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.keys(formData).forEach((key) => body.append(key, formData[key]));
    if (imageFile) body.append("miniature", imageFile);

    try {
      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, body, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/products", body, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      setIsFormOpen(false);
      reloadData();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      reloadData();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  // Filtrado
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const restoId = prod.restaurant?._id || prod.restaurant;
    const matchesResto = selectedRestaurant === "all" || restoId === selectedRestaurant;

    return matchesSearch && matchesResto;
  });

  const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="admin-page products-page" style={{ padding: "1.5rem" }}>
      <header className="page-header" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
            <LuUtensils /> Catálogo Global de Productos
          </h1>
          <p style={{ margin: "0.5rem 0 0", color: "#666" }}>
            Aprobación, categorías y moderación de platillos ofrecidos en la aplicación.
          </p>
        </div>
        <button 
          onClick={() => handleOpenForm()} 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", background: "#e11d48", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          <LuPlus /> Nuevo Producto
        </button>
      </header>

      {/* Barra de Filtros */}
      <div className="toolbar" style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", padding: "0.5rem 1rem", borderRadius: "8px", flex: 1, minWidth: "240px" }}>
          <LuSearch style={{ marginRight: "0.5rem", color: "#64748b" }} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", width: "100%" }}
          />
        </div>

        <select 
          value={selectedRestaurant} 
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }}
        >
          <option value="all">Todos los Restaurantes</option>
          {restaurants.map((resto) => (
            <option key={resto._id} value={resto._id}>
              {resto.name}
            </option>
          ))}
        </select>
      </div>

      {/* Estados de carga o error */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <LuLoader className="spinner" style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }} />
          <p>Cargando productos...</p>
        </div>
      ) : errorMessage ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
          <p>{errorMessage}</p>
          <button onClick={reloadData} style={{ padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}>Reintentar</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#f8fafc", borderRadius: "12px" }}>
          <h3>No hay productos registrados</h3>
          <p>Usa el botón superior para crear un nuevo producto.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {filteredProducts.map((prod) => {
            const imgUrl = getImageUrl(prod.miniature || prod.image) || fallbackImg;
            const restoName = prod.restaurant?.name || "Restaurante Desconocido";

            return (
              <div key={prod._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "160px", position: "relative", background: "#000" }}>
                  <img 
                    src={imgUrl} 
                    alt={prod.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                  />
                  <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>
                    {prod.category || "General"}
                  </span>
                </div>

                <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>{prod.name}</h3>
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <LuStore /> {restoName}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", height: "2.5rem", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {prod.description || "Sin descripción."}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "0.5rem", borderTop: "1px solid #f1f5f9" }}>
                    <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#e11d48" }}>
                      S/ {Number(prod.price || 0).toFixed(2)}
                    </span>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleOpenForm(prod)} style={{ background: "#f1f5f9", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>
                        <LuPencil />
                      </button>
                      <button onClick={() => handleDelete(prod._id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal CRUD */}
      {isFormOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "500px", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0 }}>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
              <button onClick={() => setIsFormOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}><LuX /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Nombre del producto</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Precio (S/)</label>
                  <input type="number" step="0.10" required value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Categoría</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Restaurante</label>
                <select value={formData.restaurant} onChange={(e) => setFormData({...formData, restaurant: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Imagen</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ width: "100%" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Descripción</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ padding: "0.5rem 1rem", background: "#e11d48", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;