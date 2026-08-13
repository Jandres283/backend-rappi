import RestaurantCard from "./RestaurantCard";

const RestaurantGrid = ({ restaurants = [], onSelectRestaurant }) => {
  if (!restaurants || restaurants.length === 0) {
    return <div className="no-restaurants">No hay restaurantes disponibles en tu zona.</div>;
  }

  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => {
        if (!restaurant) return null;
        
        return (
          <RestaurantCard
            key={restaurant._id || restaurant.id}
            restaurant={restaurant}
            onClick={onSelectRestaurant}
          />
        );
      })}
    </div>
  );
};

export default RestaurantGrid;