import { useState, useEffect } from "react";
import api from "@/api/axios";
import NewsTable from "@/components/Admin/News/NewsTable";
import NewsModalForm from "@/components/Admin/News/NewsModalForm";

export const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Cargar noticias desde la API
  useEffect(() => {
    let isMounted = true;

    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/news?page=1&limit=50");
        const data = response.data;
        const list = Array.isArray(data) ? data : data?.docs || data?.news || [];
        
        if (isMounted) {
          setNewsList(list);
        }
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger]);

  // Función para forzar la recarga tras crear, editar o eliminar
  const reloadNews = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const handleOpenCreate = () => {
    setCurrentNews(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (newsItem) => {
    setCurrentNews(newsItem);
    setIsModalOpen(true);
  };

  // Guardar (Crear o Editar)
  const handleSubmitForm = async (formData) => {
    try {
      const isFormData = formData instanceof FormData;
      const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};

      if (currentNews) {
        const id = currentNews._id || currentNews.id;
        await api.patch(`/news/${id}`, formData, config);
      } else {
        await api.post("/news", formData, config);
      }
      
      setIsModalOpen(false);
      reloadNews();
    } catch (error) {
      console.error("Error al procesar la noticia:", error);
      alert(
        "Error al procesar la noticia: " + 
        (error.response?.data?.msg || error.response?.data?.message || error.message)
      );
    }
  };

  // Eliminar Noticia
  const handleDeleteNews = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta noticia?")) return;

    try {
      await api.delete(`/news/${id}`);
      reloadNews();
    } catch (error) {
      console.error("Error al eliminar la noticia:", error);
      alert(
        "Error al eliminar la noticia: " + 
        (error.response?.data?.msg || error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="admin-page news-admin-page" style={{ padding: "1.5rem" }}>
      <div className="admin-header-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Gestión de Novedades y Anuncios</h1>
          <p style={{ color: "#666", margin: "0.5rem 0 0" }}>
            Administración de banners, promociones globales y noticias para los usuarios.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleOpenCreate}
          style={{ padding: "0.6rem 1.2rem", background: "#e11d48", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          + Nueva Noticia
        </button>
      </div>

      <NewsTable
        newsList={newsList}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteNews}
        isLoading={isLoading}
      />

      <NewsModalForm
        key={currentNews ? currentNews._id || currentNews.id : "new-modal"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        currentNews={currentNews}
      />
    </div>
  );
};

export default NewsPage;