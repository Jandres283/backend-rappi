// src/components/Admin/UserWelcome/UserWelcome.jsx
import "./UserWelcome.scss";

const UserWelcome = ({ user }) => {
  const userName = user?.name || user?.fullname || "Administrador";

  return (
    <div className="user-welcome-widget">
      <div className="user-welcome-widget__info">
        <h2>Hola, {userName} 👋</h2>
        <p>Bienvenido al panel de administración del sistema.</p>
      </div>
    </div>
  );
};

export default UserWelcome;