import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import "./CartItem.scss";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { id, _id, name, title, price, quantity, image } = item || {};
  const itemId = id || _id;
  const itemTitle = name || title || "Producto";
  const itemPrice = Number(price) || 0;
  const itemQty = Number(quantity) || 1;

  return (
    <div className="cart-item">
      {image && (
        <img 
          src={image} 
          alt={itemTitle} 
          className="cart-item-image" 
        />
      )}
      
      <div className="item-info">
        <h4>{itemTitle}</h4>
        <span className="item-price">
          ${(itemPrice * itemQty).toFixed(2)}
        </span>
      </div>

      <div className="item-controls">
        <button 
          type="button"
          onClick={() => onUpdateQuantity && onUpdateQuantity(itemId, itemQty - 1)}
        >
          <FiMinus />
        </button>

        <span>{itemQty}</span>

        <button 
          type="button"
          onClick={() => onUpdateQuantity && onUpdateQuantity(itemId, itemQty + 1)}
        >
          <FiPlus />
        </button>

        <button 
          type="button"
          className="btn-remove" 
          onClick={() => onRemove && onRemove(itemId)}
          title="Eliminar producto"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItem;