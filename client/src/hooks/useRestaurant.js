// src/hooks/useRestaurant.js
import { useContext } from "react";
import { RestaurantContext } from "../context/RestaurantContext";

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant debe ser utilizado dentro de un RestaurantProvider");
  }
  return context;
};

export default useRestaurant;