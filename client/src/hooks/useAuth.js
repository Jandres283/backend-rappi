import { useContext } from "react";
// Usamos alias o la ruta relativa exacta unificada
import { AuthContext } from "@/context/AuthContext"; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};

export default useAuth;