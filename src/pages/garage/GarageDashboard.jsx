// GarageDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/GarageDashboard.css';

const NAV = [
  { icon: '▦',  label: 'Dashboard',        id: 'dashboard' },
  { icon: '👥', label: 'Mechanics',         id: 'mechanics' },
  { icon: '📋', label: 'Requests',          id: 'requests'  },
  { icon: '🔧', label: 'Jobs in progress',  id: 'progress'  },
  { icon: '✅', label: 'Completed',         id: 'completed' },
  { icon: '📦', label: 'Inventory',         id: 'inventory' },
  { icon: '🏪', label: 'Suppliers',         id: 'suppliers' },
  { icon: '📊', label: 'Analytics',         id: 'analytics' },
  { icon: '⚙',  label: 'Settings',          id: 'settings'  },
];

const STATUS_BADGE = {
  pending:     <span className="garage-badge garage-badge-pending">⏳ Pending</span>,
  accepted:    <span className="garage-badge garage-badge-accepted">✓ Accepted</span>,
  in_progress: <span className="garage-badge garage-badge-in_progress">🔧 In progress</span>,
  completed:   <span className="garage-badge garage-badge-completed">✅ Completed</span>,
  cancelled:   <span className="garage-badge garage-badge-cancelled">✕ Cancelled</span>,
};

const ENGINE_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Rotary', 'CNG'];
const SPECIALIZATIONS = ['Engine Repair', 'Transmission', 'Electrical', 'Brakes', 'Suspension', 'AC & Cooling', 'Exhaust', 'Diagnostics'];

export default function GarageDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebar] = useState(false);
  const [requests, setRequests] = useState([]);
  const [garage, setGarage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mechanics, setMechanics] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showMechanicModal, setShowMechanicModal] = useState(false);
  const [showPartRequestModal, setShowPartRequestModal] = useState(false);
  const [selectedJobForParts, setSelectedJobForParts] = useState(null);
  const [showSupplierOrderModal, setShowSupplierOrderModal] = useState(false);
  const [selectedPartForOrder, setSelectedPartForOrder] = useState(null);

  const name = localStorage.getItem('name') || 'Garage Owner';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role !== 'garage_owner') {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [garageRes, requestsRes, mechanicsRes, inventoryRes, suppliersRes] = await Promise.all([
        api.get('/garages/my-garage'),
        api.get('/requests/incoming'),
        api.get('/mechanics'),
        api.get('/inventory'),
        api.get('/suppliers'),
      ]);
      setGarage(garageRes.data);
      setRequests(requestsRes.data);
      setMechanics(mechanicsRes.data);
      setInventory(inventoryRes.data);
      setSuppliers(suppliersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, status, note = '') => {
    try {
      await api.patch(`/requests/${requestId}/status`, {
        status,
        garage_note: note || null,
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleGarage = async () => {
    try {
      const res = await api.patch('/garages/my-garage/toggle-open');
      setGarage(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addMechanic = async (mechanicData) => {
    try {
      await api.post('/mechanics', mechanicData);
      fetchAllData();
      setShowMechanicModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateMechanic = async (id, data) => {
    try {
      await api.patch(`/mechanics/${id}`, data);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMechanic = async (id) => {
    if (window.confirm('Remove this mechanic?')) {
      try {
        await api.delete(`/mechanics/${id}`);
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const assignJobToMechanic = async (requestId, mechanicId) => {
    try {
      await api.patch(`/requests/${requestId}/assign`, { mechanic_id: mechanicId });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const addInventoryItem = async (item) => {
    try {
      await api.post('/inventory', item);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateInventoryStock = async (id, quantity) => {
    try {
      await api.patch(`/inventory/${id}/stock`, { quantity });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const requestPartFromSupplier = async (supplierId, partName, quantity) => {
    try {
      await api.post('/purchase-orders', {
        supplier_id: supplierId,
        part_name: partName,
        quantity,
        garage_id: garage?.id
      });
      alert('Order request sent to supplier');
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const requestPartNeededForJob = async (requestId, partsNeeded) => {
    try {
      await api.post(`/requests/${requestId}/parts-request`, { parts: partsNeeded });
      alert('Part request submitted. You can now order from suppliers.');
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const stats = [
    {
      label: 'Total requests',
      value: requests.length,
      icon: '📋',
      color: 'rgba(59,130,246,0.15)',
      change: 'All time',
    },
    {
      label: 'Pending',
      value: requests.filter(r => r.status === 'pending').length,
      icon: '⏳',
      color: 'rgba(234,179,8,0.15)',
      change: 'Needs action',
    },
    {
      label: 'Active jobs',
      value: requests.filter(r => r.status === 'in_progress').length,
      icon: '🔧',
      color: 'rgba(232,120,32,0.15)',
      change: 'In workshop',
    },
    {
      label: 'Mechanics',
      value: mechanics.length,
      icon: '👥',
      color: 'rgba(34,197,94,0.15)',
      change: 'On staff',
    },
    {
      label: 'Inventory items',
      value: inventory.length,
      icon: '📦',
      color: 'rgba(139,92,246,0.15)',
      change: 'In stock',
    },
  ];

  const filteredRequests = active === 'requests' ? requests :
    active === 'progress' ? requests.filter(r => r.status === 'in_progress') :
    active === 'completed' ? requests.filter(r => r.status === 'completed') :
    requests;

  const showTable = ['dashboard', 'requests', 'progress', 'completed'].includes(active);

  return (
    <div className="garage-dashboard">
      {sidebarOpen && (
        <div onClick={() => setSidebar(false)} className="garage-sidebar-overlay" />
      )}

      <aside className={`garage-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="garage-sidebar-logo">
          <div className="garage-sidebar-logo-icon">⚙</div>
          <span className="garage-sidebar-logo-text">GarageConnect</span>
        </Link>

        <div className="garage-sidebar-section">
          <div className="garage-sidebar-section-label">Main menu</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`garage-sidebar-link ${active === item.id ? 'active' : ''}`}
              onClick={() => { setActive(item.id); setSidebar(false); }}
            >
              <span className="garage-sidebar-link-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="garage-sidebar-bottom">
          {garage && (
            <div className="garage-sidebar-garage-badge">
              <div className="garage-sidebar-garage-name">{garage.name}</div>
              <div className="garage-sidebar-garage-status">
                <div className={`garage-status-dot ${garage.is_open ? 'open' : 'closed'}`} />
                <span>{garage.is_open ? 'Open for business' : 'Closed'}</span>
              </div>
            </div>
          )}
          <button className="garage-sidebar-link" onClick={logout}>
            <span className="garage-sidebar-link-icon">🚪</span>
            Sign out
          </button>
        </div>
      </aside>

      <div className="garage-main">
        <div className="garage-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebar(o => !o)} className="garage-sidebar-toggle">
              ☰
            </button>
            <div>
              <div className="garage-topbar-title">
                {NAV.find(n => n.id === active)?.label || 'Dashboard'}
              </div>
              <div className="garage-topbar-sub">
                {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="garage-topbar-right">
            {garage && (
              <div className="garage-toggle-wrap" onClick={toggleGarage}>
                <button className={`garage-toggle ${garage.is_open ? 'on' : ''}`} />
                <span>{garage.is_open ? 'Open' : 'Closed'}</span>
              </div>
            )}
            <div className="garage-topbar-avatar" title={name}>{initials}</div>
          </div>
        </div>

        <div className="garage-content">
          {loading ? (
            <div className="garage-loading">Loading your dashboard...</div>
          ) : (
            <>
              {/* Dashboard Home */}
              {active === 'dashboard' && (
                <>
                  <div className="garage-stats-grid">
                    {stats.map(s => (
                      <div key={s.label} className="garage-stat-card">
                        <div className="garage-stat-card-top">
                          <span className="garage-stat-card-label">{s.label}</span>
                          <div className="garage-stat-card-icon" style={{ background: s.color }}>
                            {s.icon}
                          </div>
                        </div>
                        <div className="garage-stat-card-value">{s.value}</div>
                        <div className="garage-stat-card-change">{s.change}</div>
                      </div>
                    ))}
                  </div>

                  <div className="garage-section-header">
                    <div className="garage-section-title">Quick actions</div>
                  </div>
                  <div className="garage-quick-actions">
                    <button className="garage-quick-action-btn primary" onClick={() => setActive('mechanics')}>👥 Manage mechanics</button>
                    <button className="garage-quick-action-btn" onClick={() => setActive('inventory')}>📦 Manage inventory</button>
                    <button className="garage-quick-action-btn" onClick={() => setActive('suppliers')}>🏪 View suppliers</button>
                    <button className="garage-quick-action-btn" onClick={toggleGarage}>
                      {garage?.is_open ? '🔴 Close garage' : '🟢 Open garage'}
                    </button>
                    <button className="garage-quick-action-btn" onClick={fetchAllData}>🔄 Refresh</button>
                  </div>
                </>
              )}

              {/* Mechanics Management */}
              {active === 'mechanics' && (
                <div>
                  <div className="garage-section-header">
                    <div>
                      <div className="garage-section-title">Mechanics Team</div>
                      <div className="garage-section-sub">{mechanics.length} mechanic{mechanics.length !== 1 ? 's' : ''} on staff</div>
                    </div>
                    <button className="garage-quick-action-btn primary" onClick={() => setShowMechanicModal(true)}>+ Add Mechanic</button>
                  </div>

                  <div className="garage-mechanics-grid">
                    {mechanics.map(mechanic => (
                      <div key={mechanic.id} className="garage-mechanic-card">
                        <div className="garage-mechanic-avatar">{mechanic.name?.charAt(0) || 'M'}</div>
                        <div className="garage-mechanic-info">
                          <div className="garage-mechanic-name">{mechanic.name}</div>
                          <div className="garage-mechanic-specialty">
                            {mechanic.specializations?.map(s => (
                              <span key={s} className="garage-specialty-tag">{s}</span>
                            ))}
                          </div>
                          <div className="garage-mechanic-engine">
                            🔧 {mechanic.engine_types?.join(', ')}
                          </div>
                          <div className="garage-mechanic-status">
                            <span className={`garage-status-badge ${mechanic.is_available ? 'available' : 'busy'}`}>
                              {mechanic.is_available ? 'Available' : 'Busy'}
                            </span>
                            {mechanic.current_job && (
                              <span className="current-job">Job: {mechanic.current_job}</span>
                            )}
                          </div>
                        </div>
                        <div className="garage-mechanic-actions">
                          <button className="garage-table-btn" onClick={() => updateMechanic(mechanic.id, { is_available: !mechanic.is_available })}>
                            {mechanic.is_available ? 'Mark Busy' : 'Mark Available'}
                          </button>
                          <button className="garage-table-btn cancel" onClick={() => deleteMechanic(mechanic.id)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pending Job Assignments */}
                  <div className="garage-section-header" style={{ marginTop: 32 }}>
                    <div className="garage-section-title">Pending Job Assignments</div>
                  </div>
                  <div className="garage-requests-wrap">
                    <table className="garage-requests-table">
                      <thead>
                        <tr><th>Job</th><th>Customer</th><th>Assign to</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {requests.filter(r => r.status === 'accepted' && !r.mechanic_id).map(req => (
                          <tr key={req.id}>
                            <td><div className="garage-request-desc">{req.description?.substring(0, 50)}</div></td>
                            <td>Car owner #{req.car_owner_id}</td>
                            <td>
                              <select id={`assign-${req.id}`} className="garage-assign-select">
                                <option value="">Select mechanic</option>
                                {mechanics.filter(m => m.is_available).map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <button className="garage-table-btn accept" onClick={() => {
                                const select = document.getElementById(`assign-${req.id}`);
                                if (select.value) assignJobToMechanic(req.id, select.value);
                              }}>Assign</button>
                            </td>
                          </tr>
                        ))}
                        {requests.filter(r => r.status === 'accepted' && !r.mechanic_id).length === 0 && (
                          <tr><td colSpan="4" style={{ textAlign: 'center', padding: 40 }}>No pending assignments</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Inventory Management */}
              {active === 'inventory' && (
                <div>
                  <div className="garage-section-header">
                    <div>
                      <div className="garage-section-title">Parts Inventory</div>
                      <div className="garage-section-sub">Track stock levels and reorder parts</div>
                    </div>
                    <button className="garage-quick-action-btn primary" onClick={() => {
                      const name = prompt('Part name:');
                      if (name) addInventoryItem({ name, quantity: 0, min_stock: 5 });
                    }}>+ Add Part</button>
                  </div>

                  <div className="garage-inventory-stats">
                    <div className="garage-inventory-stat">
                      <span>Total SKUs</span>
                      <strong>{inventory.length}</strong>
                    </div>
                    <div className="garage-inventory-stat">
                      <span>Low Stock Items</span>
                      <strong className="warning">{inventory.filter(i => i.quantity <= i.min_stock).length}</strong>
                    </div>
                    <div className="garage-inventory-stat">
                      <span>Total Value</span>
                      <strong>KSh {inventory.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="garage-requests-wrap">
                    <table className="garage-requests-table">
                      <thead>
                        <tr><th>Part Name</th><th>Quantity</th><th>Min Stock</th><th>Status</th><th>Price</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {inventory.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.min_stock}</td>
                            <td>
                              <span className={`garage-stock-status ${item.quantity <= item.min_stock ? 'low' : 'good'}`}>
                                {item.quantity <= item.min_stock ? '⚠️ Low Stock' : '✓ In Stock'}
                              </span>
                            </td>
                            <td>KSh {item.price?.toLocaleString() || '—'}</td>
                            <td>
                              <div className="garage-table-actions">
                                <button className="garage-table-btn" onClick={() => {
                                  const qty = prompt('Update quantity:', item.quantity);
                                  if (qty !== null) updateInventoryStock(item.id, parseInt(qty));
                                }}>Update Stock</button>
                                <button className="garage-table-btn" onClick={() => {
                                  setSelectedPartForOrder(item);
                                  setShowSupplierOrderModal(true);
                                }}>Order More</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Parts needed for active jobs */}
                  <div className="garage-section-header" style={{ marginTop: 32 }}>
                    <div className="garage-section-title">Parts Needed for Active Jobs</div>
                  </div>
                  <div className="garage-parts-needed-list">
                    {requests.filter(r => r.status === 'in_progress' && r.parts_needed?.length).map(req => (
                      <div key={req.id} className="garage-parts-card">
                        <div className="garage-parts-header">
                          <strong>Job #{req.id}</strong> - {req.description?.substring(0, 50)}
                          <button className="garage-table-btn" onClick={() => {
                            setSelectedJobForParts(req);
                            setShowPartRequestModal(true);
                          }}>Request Parts</button>
                        </div>
                        <div className="garage-parts-list">
                          {req.parts_needed?.map((part, i) => (
                            <div key={i} className="garage-part-item">
                              <span>{part.name}</span>
                              <span>Qty: {part.quantity}</span>
                              <span className={`garage-part-status ${part.status}`}>
                                {part.status === 'in_store' ? '✓ In Store' : 
                                 part.status === 'ordered' ? '📦 Ordered' : '⏳ Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {requests.filter(r => r.status === 'in_progress' && r.parts_needed?.length).length === 0 && (
                      <div className="garage-empty-state">
                        <div className="garage-empty-icon">✅</div>
                        <div className="garage-empty-title">No parts needed</div>
                        <div className="garage-empty-sub">Active jobs don't have any part requests yet</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Suppliers Management */}
              {active === 'suppliers' && (
                <div>
                  <div className="garage-section-header">
                    <div>
                      <div className="garage-section-title">Suppliers & Partners</div>
                      <div className="garage-section-sub">Nearby garages and parts suppliers</div>
                    </div>
                    <button className="garage-quick-action-btn primary" onClick={() => alert('Add supplier form coming soon')}>+ Add Supplier</button>
                  </div>

                  <div className="garage-suppliers-grid">
                    {suppliers.map(supplier => (
                      <div key={supplier.id} className="garage-supplier-card">
                        <div className="garage-supplier-header">
                          <span className="garage-supplier-name">{supplier.name}</span>
                          <span className={`garage-supplier-type ${supplier.type}`}>
                            {supplier.type === 'garage' ? '🔧 Garage' : '🏭 Supplier'}
                          </span>
                        </div>
                        <div className="garage-supplier-details">
                          <div>📍 {supplier.location}</div>
                          <div>📞 {supplier.phone}</div>
                          <div>📧 {supplier.email}</div>
                        </div>
                        <div className="garage-supplier-parts">
                          <strong>Available Parts:</strong>
                          <div className="garage-parts-tags">
                            {supplier.parts?.slice(0, 3).map(p => (
                              <span key={p} className="garage-part-tag">{p}</span>
                            ))}
                            {supplier.parts?.length > 3 && <span>+{supplier.parts.length - 3} more</span>}
                          </div>
                        </div>
                        <button className="garage-quick-action-btn" style={{ marginTop: 12, width: '100%' }}
                          onClick={() => {
                            const part = prompt('Part name needed:');
                            if (part) requestPartFromSupplier(supplier.id, part, 1);
                          }}>
                          Request Parts
                        </button>
                      </div>
                    ))}
                    {suppliers.length === 0 && (
                      <div className="garage-empty-state" style={{ gridColumn: '1/-1' }}>
                        <div className="garage-empty-icon">🏪</div>
                        <div className="garage-empty-title">No suppliers added yet</div>
                        <div className="garage-empty-sub">Add suppliers to start ordering parts</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Requests Table (Dashboard, Requests, Progress, Completed) */}
              {showTable && (
                <>
                  <div className="garage-section-header">
                    <div>
                      <div className="garage-section-title">
                        {active === 'dashboard' ? 'Recent requests' :
                         active === 'progress' ? 'Jobs in progress' :
                         active === 'completed' ? 'Completed jobs' : 'All requests'}
                      </div>
                      <div className="garage-section-sub">{filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}</div>
                    </div>
                    <button className="garage-quick-action-btn" onClick={fetchAllData}>🔄 Refresh</button>
                  </div>

                  <div className="garage-requests-wrap">
                    {filteredRequests.length === 0 ? (
                      <div className="garage-empty-state">
                        <div className="garage-empty-icon">📭</div>
                        <div className="garage-empty-title">No requests yet</div>
                        <div className="garage-empty-sub">When car owners send requests, they will appear here</div>
                      </div>
                    ) : (
                      <table className="garage-requests-table">
                        <thead>
                          <tr>
                            <th>Customer</th>
                            <th>Description</th>
                            <th>Mechanic</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRequests.map(req => (
                            <tr key={req.id}>
                              <td>
                                <div className="garage-request-customer">
                                  Car owner #{req.car_owner_id}
                                </div>
                              </td>
                              <td>
                                <div className="garage-request-desc">{req.description}</div>
                              </td>
                              <td style={{ fontSize: 12 }}>{req.mechanic_name || 'Unassigned'}</td>
                              <td style={{ fontSize: 12 }}>
                                {req.created_at ? new Date(req.created_at).toLocaleString() : '—'}
                              </td>
                              <td>{STATUS_BADGE[req.status]}</td>
                              <td>
                                <div className="garage-table-actions">
                                  {req.status === 'pending' && (
                                    <>
                                      <button className="garage-table-btn accept" onClick={() => updateStatus(req.id, 'accepted')}>
                                        Accept
                                      </button>
                                      <button className="garage-table-btn cancel" onClick={() => updateStatus(req.id, 'cancelled')}>
                                        Decline
                                      </button>
                                    </>
                                  )}
                                  {req.status === 'accepted' && (
                                    <button className="garage-table-btn complete" onClick={() => updateStatus(req.id, 'in_progress')}>
                                      Start job
                                    </button>
                                  )}
                                  {req.status === 'in_progress' && (
                                    <>
                                      <button className="garage-table-btn accept" onClick={() => updateStatus(req.id, 'completed')}>
                                        Mark done
                                      </button>
                                      <button className="garage-table-btn" onClick={() => {
                                        setSelectedJobForParts(req);
                                        setShowPartRequestModal(true);
                                      }}>
                                        Request Parts
                                      </button>
                                    </>
                                  )}
                                  {['completed', 'cancelled'].includes(req.status) && (
                                    <span style={{ fontSize: 12, color: '#555' }}>—</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}

              {/* Analytics */}
              {active === 'analytics' && (
                <div className="garage-empty-state">
                  <div className="garage-empty-icon">📊</div>
                  <div className="garage-empty-title">Analytics Dashboard</div>
                  <div className="garage-empty-sub">
                    Revenue: KSh 0 | Jobs completed: {requests.filter(r => r.status === 'completed').length}
                  </div>
                </div>
              )}

              {/* Settings */}
              {active === 'settings' && garage && (
                <div className="garage-settings-panel">
                  <div className="garage-section-title" style={{ marginBottom: 20 }}>Garage Information</div>
                  {[
                    ['Garage name', garage.name],
                    ['Address', garage.address],
                    ['Phone', garage.phone],
                    ['Rating', `${garage.rating} ★`],
                    ['Coordinates', `${garage.latitude}, ${garage.longitude}`],
                  ].map(([label, value]) => (
                    <div key={label} className="garage-settings-row">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showMechanicModal && (
        <MechanicModal onClose={() => setShowMechanicModal(false)} onSave={addMechanic} />
      )}

      {showPartRequestModal && selectedJobForParts && (
        <PartRequestModal job={selectedJobForParts} onClose={() => setShowPartRequestModal(false)} onSave={requestPartNeededForJob} />
      )}

      {showSupplierOrderModal && selectedPartForOrder && (
        <SupplierOrderModal part={selectedPartForOrder} suppliers={suppliers} onClose={() => setShowSupplierOrderModal(false)} onOrder={requestPartFromSupplier} />
      )}
    </div>
  );
}

// Mechanic Modal Component
function MechanicModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [engineTypes, setEngineTypes] = useState([]);

  const handleSave = () => {
    if (name) {
      onSave({ name, specializations, engine_types: engineTypes });
      onClose();
    }
  };

  return (
    <div className="garage-modal-overlay" onClick={onClose}>
      <div className="garage-modal" onClick={e => e.stopPropagation()}>
        <div className="garage-modal-header">Add Mechanic</div>
        <div className="garage-modal-body">
          <input 
            type="text" 
            placeholder="Full name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="garage-modal-input" 
          />
          
          <label>Specializations:</label>
          <div className="garage-checkbox-group">
            {SPECIALIZATIONS.map(spec => (
              <label key={spec} className="garage-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={specializations.includes(spec)} 
                  onChange={e => {
                    if (e.target.checked) setSpecializations([...specializations, spec]);
                    else setSpecializations(specializations.filter(s => s !== spec));
                  }} 
                /> {spec}
              </label>
            ))}
          </div>

          <label>Engine Types:</label>
          <div className="garage-checkbox-group">
            {ENGINE_TYPES.map(engine => (
              <label key={engine} className="garage-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={engineTypes.includes(engine)} 
                  onChange={e => {
                    if (e.target.checked) setEngineTypes([...engineTypes, engine]);
                    else setEngineTypes(engineTypes.filter(e => e !== engine));
                  }} 
                /> {engine}
              </label>
            ))}
          </div>
        </div>
        <div className="garage-modal-footer">
          <button className="garage-modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="garage-modal-btn save" onClick={handleSave}>Add Mechanic</button>
        </div>
      </div>
    </div>
  );
}

// Part Request Modal
function PartRequestModal({ job, onClose, onSave }) {
  const [parts, setParts] = useState([{ name: '', quantity: 1 }]);

  const addPart = () => setParts([...parts, { name: '', quantity: 1 }]);
  const updatePart = (idx, field, value) => {
    const newParts = [...parts];
    newParts[idx][field] = value;
    setParts(newParts);
  };

  return (
    <div className="garage-modal-overlay" onClick={onClose}>
      <div className="garage-modal" onClick={e => e.stopPropagation()}>
        <div className="garage-modal-header">Parts Needed for Job</div>
        <div className="garage-modal-body">
          <div className="garage-job-info">Job: {job.description?.substring(0, 100)}</div>
          {parts.map((part, idx) => (
            <div key={idx} className="garage-part-input-row">
              <input 
                type="text" 
                placeholder="Part name" 
                value={part.name} 
                onChange={e => updatePart(idx, 'name', e.target.value)} 
              />
              <input 
                type="number" 
                placeholder="Qty" 
                value={part.quantity} 
                onChange={e => updatePart(idx, 'quantity', parseInt(e.target.value) || 1)} 
                style={{ width: 80 }} 
              />
            </div>
          ))}
          <button className="garage-add-part-btn" onClick={addPart}>+ Add another part</button>
        </div>
        <div className="garage-modal-footer">
          <button className="garage-modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="garage-modal-btn save" onClick={() => onSave(job.id, parts.filter(p => p.name))}>Submit Request</button>
        </div>
      </div>
    </div>
  );
}

// Supplier Order Modal
function SupplierOrderModal({ part, suppliers, onClose, onOrder }) {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="garage-modal-overlay" onClick={onClose}>
      <div className="garage-modal" onClick={e => e.stopPropagation()}>
        <div className="garage-modal-header">Order {part.name}</div>
        <div className="garage-modal-body">
          <select 
            className="garage-modal-input" 
            value={selectedSupplier} 
            onChange={e => setSelectedSupplier(e.target.value)}
          >
            <option value="">Select supplier</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input 
            type="number" 
            placeholder="Quantity" 
            value={quantity} 
            onChange={e => setQuantity(parseInt(e.target.value) || 1)} 
            className="garage-modal-input" 
          />
          <div className="current-stock" style={{ fontSize: 12, color: '#666' }}>
            Current stock: {part.quantity}
          </div>
        </div>
        <div className="garage-modal-footer">
          <button className="garage-modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="garage-modal-btn save" onClick={() => {
            if (selectedSupplier) onOrder(selectedSupplier, part.name, quantity);
            onClose();
          }}>Place Order</button>
        </div>
      </div>
    </div>
  );
}