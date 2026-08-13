// src/components/Web/Products/ProductSearch.jsx
const ProductSearch = ({ category, onCategoryChange }) => {
  const categories = ["Todos", "Hamburguesas", "Pizzas", "Bebidas", "Postres"];

  return (
    <div className="product-search-filter">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-chip ${category === cat ? "active" : ""}`}
          onClick={() => onCategoryChange && onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductSearch;