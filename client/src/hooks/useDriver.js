// src/hooks/useDriver.js
import { useContext } from "react";
import { DriverContext } from "../context/DriverContext";

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error("useDriver debe ser utilizado dentro de un DriverProvider");
  }
  return context;
};

export default useDriver;