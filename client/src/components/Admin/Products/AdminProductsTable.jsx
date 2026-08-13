// src/components/Admin/Products/AdminProductsTable.jsx
const AdminProductsTable = ({ products = [], onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="admin-loading">Cargando productos...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="admin-empty">No hay productos disponibles.</div>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Restaurante</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => {
            const id = prod._id || prod.id;
            return (
              <tr key={id}>
                <td>
                  {prod.image || prod.miniature ? (
                    <img
                      src={prod.image || prod.miniature}
                      alt={prod.name}
                      className="table-thumbnail"
                    />
                  ) : (
                    <span className="no-img">Sin imagen</span>
                  )}
                </td>
                <td>{prod.name}</td>
                <td>{prod.restaurant?.name || "N/A"}</td>
                <td>${typeof prod.price === "number" ? prod.price.toFixed(2) : prod.price}</td>
                <td>
                  {onDelete && (
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete(id)}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductsTable;