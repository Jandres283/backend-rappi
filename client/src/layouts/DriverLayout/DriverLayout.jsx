import { Outlet, Link, useLocation } from "react-router-dom";
import "./DriverLayout.scss";

export const DriverLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="driverContainer">
      <header className="topHeader">
        <h1>Panel Repartidor</h1>
      </header>

      <main className="driverContent">
        <Outlet />
      </main>

      <nav className="bottomNav">
        <Link 
          to="/driver/active" 
          className={isActive('/driver/active') ? 'active' : ''}
        >
          Pedido Activo
        </Link>
        <Link 
          to="/driver/available" 
          className={isActive('/driver/available') ? 'active' : ''}
        >
          Disponibles
        </Link>
        <Link 
          to="/driver/history" 
          className={isActive('/driver/history') ? 'active' : ''}
        >
          Historial
        </Link>
      </nav>
    </div>
  );
};

export default DriverLayout;