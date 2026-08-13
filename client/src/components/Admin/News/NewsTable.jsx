import { ENV } from "@/utils";

const formatImage = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  const serverHost = ENV.SERVER_HOST || "http://localhost:3977";
  return cleanPath.startsWith("uploads/")
    ? `${serverHost}/${cleanPath}`
    : `${serverHost}/uploads/${cleanPath}`;
};

const NewsTable = ({ newsList = [], onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="admin-loading">Cargando noticias...</div>;
  }

  if (!newsList || newsList.length === 0) {
    return <div className="admin-empty">No hay noticias publicadas.</div>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((item) => {
            const imgUrl = formatImage(item.miniature || item.image);

            return (
              <tr key={item._id || item.id}>
                <td>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="table-thumbnail"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : (
                    <span className="no-img">Sin imagen</span>
                  )}
                </td>
                <td>
                  <strong>{item.title}</strong>
                </td>
                <td>
                  <span className="badge-category">{item.category || "General"}</span>
                </td>
                <td>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(item._id || item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NewsTable;