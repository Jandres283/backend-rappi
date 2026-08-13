import { getImageUrl } from "@/utils"; 
import { JPG } from "@/assets"; // O una imagen local si la tienes

export const RestaurantCard = ({ restaurant, onClick }) => {
  if (!restaurant) return null;

  const { 
    name, 
    image, 
    avatar, 
    logo, 
    rating, 
    deliveryTime, 
    estimatedTime, 
    category 
  } = restaurant;

  // 1. Obtener la ruta limpia
  const rawImagePath = image || avatar || logo;

  // 2. Generar URL final
  const finalSrc = getImageUrl(rawImagePath);

  // 🧪 LOG DE CONTROL (Revisa la consola F12 para ver si la URL existe)
  // console.log(`[RestaurantCard] ${name} -> src final:`, finalSrc);

  const time = deliveryTime || estimatedTime || "25-35 min";

  return (
    <div 
      className="restaurant-card" 
      onClick={() => onClick && onClick(restaurant)}
      style={{ cursor: "pointer" }}
    >
      <div className="restaurant-image">
        <img 
          src={finalSrc} 
          alt={name || "Restaurante"} 
          onError={(e) => {
            e.target.onerror = null; 
            // Mostramos un placeholder genérico local si falla la red
            e.target.src = JPG?.heroBanner || "https://placehold.co/600x400?text=Sin+Imagen";
          }}
        />
      </div>

      <div className="restaurant-info">
        <h4>{name || "Sin Nombre"}</h4>
        <p className="category">{category || "Comida Rápida"}</p>
        
        <div className="meta-info">
          <span>⭐ {rating || "4.5"}</span>
          <span>⏱️ {time}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;