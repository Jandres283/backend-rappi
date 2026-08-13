import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.scss';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pedidos');

  const [restaurantsList, setRestaurantsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const userEmail = localStorage.getItem('adminEmail') || 'admin@protecrappi.com';

  // Verificar sesión
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Cargar lista desde MongoDB al presionar la pestaña 'restaurantes'
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (activeTab !== 'restaurantes') return;

      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
        const res = await fetch('http://localhost:3977/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.docs) {
            setRestaurantsList(data.docs);
          } else if (Array.isArray(data)) {
            setRestaurantsList(data);
          } else {
            setRestaurantsList([]);
          }
        }
      } catch (err) {
        console.error('Error al obtener restaurantes:', err);
        setRestaurantsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <header className="admin-header">
        <div className="brand-info">
          <div className="brand-icon">🛡️</div>
          <div className="brand-text">
            <h2>ProtecRappi</h2>
            <span>Panel de Administración</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="user-pill">
            <span className="user-icon">👤</span>
            <span>{userEmail}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav className="admin-nav">
        <ul>
          <li className={activeTab === 'pedidos' ? 'active' : ''} onClick={() => setActiveTab('pedidos')}>
            🛵 Pedidos
          </li>
          <li className={activeTab === 'restaurantes' ? 'active' : ''} onClick={() => setActiveTab('restaurantes')}>
            🏢 Restaurantes
          </li>
          <li className={activeTab === 'productos' ? 'active' : ''} onClick={() => setActiveTab('productos')}>
            📦 Productos
          </li>
          <li className={activeTab === 'noticias' ? 'active' : ''} onClick={() => setActiveTab('noticias')}>
            📰 Noticias
          </li>
          <li className={activeTab === 'contacto' ? 'active' : ''} onClick={() => setActiveTab('contacto')}>
            ✉️ Contacto
          </li>
          <li className={activeTab === 'usuarios' ? 'active' : ''} onClick={() => setActiveTab('usuarios')}>
            👥 Usuarios
          </li>
          <li className={activeTab === 'clientes' ? 'active' : ''} onClick={() => setActiveTab('clientes')}>
            📇 Clientes
          </li>
        </ul>
      </nav>

      {/* CONTENIDO */}
      <main className="dashboard-content">
        {/* PESTAÑA PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="tab-pedidos">
            <div className="section-header">
              <div>
                <h1>Gestión de Pedidos 🛵</h1>
                <p>Monitorea los pedidos en tiempo real y asigna repartidores</p>
              </div>
              <div className="badges-group">
                <span className="badge badge-gray">Total Pedidos: 0</span>
                <span className="badge badge-red">Repartidores: 0</span>
              </div>
            </div>
            <div className="empty-card">No hay órdenes para mostrar.</div>
          </div>
        )}

        {/* PESTAÑA RESTAURANTES */}
        {activeTab === 'restaurantes' && (
          <div className="tab-restaurantes">
            <div className="section-header">
              <div>
                <h1>Restaurantes Registrados 🏢</h1>
                <p>Gestión y consulta directa con la Base de Datos MongoDB</p>
              </div>
              <div className="badges-group">
                <span className="badge badge-gray">Registrados: {restaurantsList.length}</span>
              </div>
            </div>

            {loading ? (
              <div className="empty-card">Cargando datos desde MongoDB...</div>
            ) : restaurantsList.length === 0 ? (
              <div className="empty-card">No hay restaurantes registrados.</div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Restaurante</th>
                      <th>Encargado / Email</th>
                      <th>Categoría</th>
                      <th>Teléfono</th>
                      <th>Dirección</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurantsList.map((rest) => (
                      <tr key={rest._id}>
                        <td>
                          {rest.image ? (
                            <img
                              src={`http://localhost:3977/uploads/${rest.image}`}
                              alt={rest.name || 'Restaurante'}
                              width="42"
                              height="42"
                              style={{ borderRadius: '8px', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '22px' }}>🏬</span>
                          )}
                        </td>
                        <td>
                          <strong>{rest.name}</strong>
                        </td>
                        <td>
                          {rest.user ? `${rest.user.firstname || ''} ${rest.user.lastname || ''}`.trim() : 'Sin Encargado'}
                          <br />
                          <small style={{ color: '#6b7280' }}>{rest.user?.email || 'N/A'}</small>
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{rest.category || 'N/A'}</td>
                        <td>{rest.phone || 'S/N'}</td>
                        <td>{rest.address || 'N/A'}</td>
                        <td>
                          <span className={`status-pill ${rest.active ? 'active' : 'inactive'}`}>
                            {rest.active ? '● Activo' : '○ Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* OTRAS PESTAÑAS */}
        {activeTab !== 'pedidos' && activeTab !== 'restaurantes' && (
          <div className="empty-card">Módulo de {activeTab} en desarrollo...</div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;