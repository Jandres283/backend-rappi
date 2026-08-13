// src/components/Web/Products/ProductGrid.jsx
import FoodCard from "../FoodCard/FoodCard";

const ProductGrid = ({ products = [], onAddToCart }) => {
  if (!products || products.length === 0) {
    return <div className="no-products">No se encontraron platillos disponibles.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <FoodCard
          key={product._id || product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;