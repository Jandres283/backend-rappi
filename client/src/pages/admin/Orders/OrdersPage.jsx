import { useState, useEffect, useRef, useCallback } from 'react';
import api from "@/api/axios";
import './OrdersPage.scss';

// 🟢 Helpers para formatear la información del cliente de forma segura
const getClientName = (user) => {
  if (!user) return 'Cliente General';
  if (user.name) return user.name;
  
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return fullName || user.email || 'Cliente General';
};

const getClientPhone = (user) => {
  if (!user) return 'Sin Teléfono';
  return user.phone || 'Sin Teléfono';
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para el Modal de Edición Completa
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: '',
    total: 0,
    deliveryFee: 0,
    status: 'PENDING'
  });

  // Referencia para detener el polling si hay un error de auth o se abre el modal
  const stopPollingRef = useRef(false);

  // Helper para extraer token seguro
  const getAuthHeader = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("access") || localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ==========================================
  // 1. DECLARACIÓN DE FETCHORDERS
  // ==========================================
  const fetchOrders = useCallback(async (isInitial = false) => {
    if (stopPollingRef.current && !isInitial) return;

    const headers = getAuthHeader();
    if (!headers.Authorization) {
      if (isInitial) setLoading(false);
      setError('Sesión no encontrada. Por favor inicia sesión nuevamente.');
      stopPollingRef.current = true;
      return;
    }

    try {
      const response = await api.get('/orders', {
        params: { limit: 100, page: 1 },
        headers
      });

      const data = response.data;

      let ordersList = [];
      if (Array.isArray(data)) {
        ordersList = data;
      } else if (data && Array.isArray(data.docs)) {
        ordersList = data.docs;
      } else if (data && Array.isArray(data.orders)) {
        ordersList = data.orders;
      }

      setOrders(ordersList);
      setError('');
    } catch (err) {
      console.error("Error al consultar órdenes:", err);

      const status = err.response?.status;
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        'No se pudieron obtener los pedidos de la base de datos.';

      if (status === 401 || status === 403) {
        stopPollingRef.current = true;
      }

      setError(errorMsg);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // ==========================================
  // 2. POLLING Y TIEMPO REAL
  // ==========================================
  useEffect(() => {
    stopPollingRef.current = false;

    const loadData = async (isInitial) => {
      try {
        await fetchOrders(isInitial);
      } catch (err) {
        console.error("Error al ejecutar fetchOrders:", err);
      }
    };

    loadData(true);

    const interval = setInterval(() => {
      if (!stopPollingRef.current) {
        loadData(false);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Pausar polling cuando el modal de edición esté abierto
  useEffect(() => {
    stopPollingRef.current = !!editingOrder;
  }, [editingOrder]);

  // ==========================================
  // 3. CAMBIAR ESTADO RÁPIDO
  // ==========================================
  const handleStatusChange = async (order, newStatus) => {
    const orderId = order._id || order.id;
    if (!orderId || order.status === newStatus) return;

    const headers = getAuthHeader();

    // Update Optimista
    setOrders(prevOrders =>
      prevOrders.map(o =>
        (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o
      )
    );

    try {
      try {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus }, { headers });
      } catch (patchErr) {
        if (patchErr.response?.status === 404) {
          await api.patch(`/orders/${orderId}`, { status: newStatus }, { headers });
        } else {
          throw patchErr;
        }
      }

      await fetchOrders(false);
    } catch (err) {
      console.error("Error actualizando estado:", err);
      const msg = err.response?.data?.msg || err.response?.data?.message || err.message;
      alert(`No se pudo actualizar el estado: ${msg}`);
      await fetchOrders(false);
    }
  };

  // ==========================================
  // 4. ABRIR MODAL DE EDICIÓN COMPLETA
  // ==========================================
  const handleOpenEdit = (order) => {
    setEditingOrder(order);

    // Formateo previo de nombres si solo existe la propiedad 'name'
    let fname = order.user?.firstName || '';
    let lname = order.user?.lastName || '';

    if (!fname && order.user?.name) {
      const parts = order.user.name.trim().split(" ");
      fname = parts[0] || '';
      lname = parts.slice(1).join(" ") || '';
    }

    setFormData({
      firstName: fname,
      lastName: lname,
      phone: order.user?.phone || '',
      address: order.address || order.deliveryAddress || '',
      notes: order.notes || '',
      paymentMethod: order.paymentMethod || 'CASH',
      total: order.total || 0,
      deliveryFee: order.deliveryFee || 0,
      status: order.status || 'PENDING'
    });
  };

  // ==========================================
  // 5. GUARDAR CAMBIOS DE EDICIÓN COMPLETA
  // ==========================================
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    const orderId = editingOrder._id || editingOrder.id;
    const headers = getAuthHeader();

    try {
      const payload = {
        ...(editingOrder.user ? {
          user: {
            ...editingOrder.user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone
          }
        } : {}),
        address: formData.address,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        total: Number(formData.total),
        deliveryFee: Number(formData.deliveryFee),
        status: formData.status
      };

      try {
        await api.put(`/orders/${orderId}`, payload, { headers });
      } catch (putErr) {
        if (putErr.response?.status === 404) {
          await api.patch(`/orders/${orderId}`, payload, { headers });
        } else {
          throw putErr;
        }
      }

      setEditingOrder(null);
      await fetchOrders(false);
    } catch (err) {
      console.error("Error guardando orden:", err);
      const msg = err.response?.data?.msg || err.response?.data?.message || err.message;
      alert(`Error al guardar la orden: ${msg}`);
    }
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      PENDING: { label: 'PENDIENTE', className: 'status-pending' },
      PREPARING: { label: 'PREPARANDO', className: 'status-preparing' },
      READY: { label: 'LISTO P/ DRIVER', className: 'status-ready' },
      IN_DELIVERY: { label: 'EN CAMINO', className: 'status-delivery' },
      DELIVERED: { label: 'ENTREGADO', className: 'status-delivered' },
      CANCELLED: { label: 'CANCELADO', className: 'status-cancelled' }
    };

    const current = statusMap[status] || { label: status || 'PENDIENTE', className: 'status-pending' };
    return <span className={`status-badge ${current.className}`}>{current.label}</span>;
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="orders-page">
      <div className="orders-page__header">
        <div>
          <h1>Monitoreo General de Pedidos</h1>
          <p>Supervisión en tiempo real de órdenes globales, asignación a drivers y entregas.</p>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="orders-page__metrics">
        <div className="metric-card">
          <span className="label">ÓRDENES TOTALES</span>
          <span className="number">{safeOrders.length}</span>
        </div>
        <div className="metric-card border-orange">
          <span className="label">POR ASIGNAR / PENDIENTES</span>
          <span className="number">
            {safeOrders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length}
          </span>
        </div>
        <div className="metric-card border-blue">
          <span className="label">EN REPARTO (DRIVERS)</span>
          <span className="number">
            {safeOrders.filter(o => o.status === 'READY' || o.status === 'IN_DELIVERY').length}
          </span>
        </div>
        <div className="metric-card border-green">
          <span className="label">ENTREGADOS</span>
          <span className="number">
            {safeOrders.filter(o => o.status === 'DELIVERED').length}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="orders-page__table-card">
        {loading ? (
          <div className="state-message">Consultando MongoDB en tiempo real...</div>
        ) : error ? (
          <div className="state-message error">⚠️ {error}</div>
        ) : safeOrders.length === 0 ? (
          <div className="state-message empty">
            <span className="icon">🛵</span>
            <h3>No hay pedidos activos por el momento</h3>
            <p>Los pedidos realizados por los clientes aparecerán aquí automáticamente.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>CLIENTE & CONTACTO</th>
                  <th>RESTAURANTE</th>
                  <th>ÍTEMS</th>
                  <th>COMENTARIO</th>
                  <th>DIRECCIÓN</th>
                  <th>PAGO</th>
                  <th>TOTAL + FEE</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {safeOrders.map((order) => {
                  const orderId = order._id || order.id;
                  const clientName = getClientName(order.user);
                  const clientPhone = getClientPhone(order.user);
                  const restaurantName = order.restaurant?.name || 'Restaurante';
                  const driverName = order.deliveryDriver 
                    ? getClientName(order.deliveryDriver)
                    : 'Sin Asignar';

                  return (
                    <tr key={orderId}>
                      <td className="order-id">#{String(orderId).slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="cell-block">
                          <span className="title">{clientName}</span>
                          <span className="sub">📞 {clientPhone}</span>
                        </div>
                      </td>
                      <td><span className="restaurant-title">🏢 {restaurantName}</span></td>
                      <td>
                        <span className="items-summary">
                          {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'Sin detalle'}
                        </span>
                      </td>
                      <td>
                        {order.notes ? (
                          <div className="notes-box">📝 "{order.notes}"</div>
                        ) : (
                          <span className="no-notes">Sin nota</span>
                        )}
                      </td>
                      <td><span className="address-text">📍 {order.address || order.deliveryAddress || 'Sin dirección'}</span></td>
                      <td><span className="payment-badge">💳 {order.paymentMethod || 'Efectivo'}</span></td>
                      <td className="price">
                        <span>S/ {Number(order.total || 0).toFixed(2)}</span>
                        <small>Envío: S/ {Number(order.deliveryFee || 0).toFixed(2)}</small>
                      </td>
                      <td>{renderStatusBadge(order.status)}</td>
                      <td>
                        <div className="action-cell">
                          <select 
                            className="status-select"
                            value={order.status || 'PENDING'}
                            onChange={(e) => handleStatusChange(order, e.target.value)}
                          >
                            <option value="PENDING">⏳ PENDING (Pendiente)</option>
                            <option value="PREPARING">🍳 PREPARING (Preparando)</option>
                            <option value="READY">📦 READY (Listo p/ Driver)</option>
                            <option value="IN_DELIVERY">🛵 IN_DELIVERY (En camino)</option>
                            <option value="DELIVERED">✅ DELIVERED (Entregado)</option>
                            <option value="CANCELLED">❌ CANCELLED (Cancelar)</option>
                          </select>
                          
                          <button 
                            type="button" 
                            className="btn-edit" 
                            onClick={() => handleOpenEdit(order)}
                          >
                            ✏️ Editar Todo
                          </button>

                          <span className="driver-label">Driver: <b>{driverName}</b></span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL EDICIÓN COMPLETA */}
      {editingOrder && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Editar Pedido #{String(editingOrder._id || editingOrder.id).slice(-6).toUpperCase()}</h2>
              <button type="button" className="close-btn" onClick={() => setEditingOrder(null)}>✕</button>
            </div>

            <form className="modal-body form-grid" onSubmit={handleSaveEdit}>
              <div className="field">
                <label>Nombre del Cliente</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                />
              </div>

              <div className="field">
                <label>Apellido del Cliente</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                />
              </div>

              <div className="field">
                <label>Teléfono Contacto</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>

              <div className="field">
                <label>Método de Pago</label>
                <input 
                  type="text" 
                  value={formData.paymentMethod} 
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} 
                />
              </div>

              <div className="field full">
                <label>Dirección de Entrega</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="field full">
                <label>Comentario / Nota Especial</label>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                  rows={3}
                />
              </div>

              <div className="field">
                <label>Total Pedido (S/)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={formData.total} 
                  onChange={(e) => setFormData({...formData, total: e.target.value})} 
                />
              </div>

              <div className="field">
                <label>Tarifa Envío (S/)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={formData.deliveryFee} 
                  onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})} 
                />
              </div>

              <div className="field full">
                <label>Estado Actual</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="PENDING">PENDING (Pendiente)</option>
                  <option value="PREPARING">PREPARING (Preparando)</option>
                  <option value="READY">READY (Listo p/ Driver)</option>
                  <option value="IN_DELIVERY">IN_DELIVERY (En camino)</option>
                  <option value="DELIVERED">DELIVERED (Entregado)</option>
                  <option value="CANCELLED">CANCELLED (Cancelar)</option>
                </select>
              </div>

              <div className="modal-footer full">
                <button type="button" className="btn-cancel" onClick={() => setEditingOrder(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;