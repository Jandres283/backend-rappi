import { getImageUrl } from "@/utils";
import { PNG } from "@/assets";
import "./FoodCard.scss";

const FoodCard = ({ product, onAddToCart }) => {
  if (!product) return null;

  // 1. Soporta tanto 'name' como 'title' provenientes de MongoDB
  const name = product.name || product.title || "Platillo";
  const description = product.description || "Sin descripción disponible.";
  const price = product.price ? Number(product.price).toFixed(2) : "0.00";

  // 2. Transforma la ruta relativa de la BD a la URL completa (http://localhost:5000/uploads/...)
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="food-card">
      <img
        src={imageUrl}
        alt={name}
        className="food-image"
        onError={(e) => {
          e.target.onerror = null;
          // Si el archivo en el servidor no existe o falla la red, carga el placeholder
          e.target.src = PNG?.placeholderFood || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop";
        }}
      />
      <div className="food-body">
        <h4>{name}</h4>
        <p>{description}</p>
        <div className="food-footer">
          <span className="price">S/ {price}</span>
          <button
            className="btn-add-cart"
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;