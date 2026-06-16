import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SupplierDashboard.css';



const NAV = [
  { section: 'Overview' },
  { key: 'dashboard',  label: 'Dashboard',   icon: '📦', badge: null },
  { key: 'orders',     label: 'Orders',       icon: '🛒', badge: 3, badgeColor: 'orange' },
  { section: 'Catalogue' },
  { key: 'parts',      label: 'My parts',     icon: '🔧', badge: null },
  { key: 'lowstock',   label: 'Low stock',    icon: '⚠️', badge: 2, badgeColor: 'yellow' },
  { key: 'pricing',    label: 'Pricing',      icon: '💰', badge: null },
  { section: 'Business' },
  { key: 'revenue',    label: 'Revenue',      icon: '📊', badge: null },
  { key: 'garages',    label: 'Garages',      icon: '🏢', badge: null },
  { key: 'settings',   label: 'Settings',     icon: '⚙️', badge: null },
];

const MOCK_ORDERS = [
  { id: 1, garage: 'Ruiru Auto Centre',  parts: 'Brake pads (Toyota) ×2 · Oil filter ×3',     amount: 'KES 9,000',  time: '2 min ago',   status: 'new' },
  { id: 2, garage: 'Thika Road Motors',  parts: 'Amaron battery 55Ah ×1 · Wiper blades ×4',   amount: 'KES 12,100', time: '18 min ago',  status: 'processing' },
  { id: 3, garage: 'Kasarani Garage',    parts: 'Spark plugs (NGK) ×4 · Coolant 1L ×2',       amount: 'KES 4,500',  time: '34 min ago',  status: 'new' },
  { id: 4, garage: 'Westlands Motors',   parts: 'Engine oil 5L ×6 · Air filter ×2',            amount: 'KES 18,400', time: '2 hrs ago',   status: 'delivered' },
  { id: 5, garage: 'CBD Quick Fix',      parts: 'Alternator belt ×2 · Timing belt ×1',         amount: 'KES 6,800',  time: 'Yesterday',   status: 'delivered' },
];

const MOCK_PARTS = [
  { id: 1, name: 'Brake pads (Toyota)',  category: 'Brakes',     price: 'KES 2,400', stock: 48,  unit: 'units' },
  { id: 2, name: 'Engine oil 5L',        category: 'Fluids',     price: 'KES 2,800', stock: 120, unit: 'units' },
  { id: 3, name: 'Amaron battery 55Ah',  category: 'Electrical', price: 'KES 8,500', stock: 4,   unit: 'units' },
  { id: 4, name: 'NGK Spark plugs ×4',   category: 'Engine',     price: 'KES 3,200', stock: 62,  unit: 'units' },
  { id: 5, name: 'Alternator belt',       category: 'Engine',     price: 'KES 1,800', stock: 0,   unit: 'units' },
  { id: 6, name: 'Air filter',            category: 'Engine',     price: 'KES 1,100', stock: 33,  unit: 'units' },
  { id: 7, name: 'Coolant 1L',            category: 'Fluids',     price: 'KES 650',   stock: 80,  unit: 'units' },
  { id: 8, name: 'Wiper blades',          category: 'Body',       price: 'KES 900',   stock: 15,  unit: 'units' },
];

function stockStatus(stock) {
  if (stock === 0)  return 'out';
  if (stock <= 5)   return 'low';
  return 'ok';
}

function stockLabel(stock) {
  if (stock === 0)  return 'Out of stock';
  return `${stock} units`;
}

export default function SupplierDashboard() {
  const navigate       = useNavigate();
  const [active, setActive]       = useState('dashboard');
  const [sidebarOpen, setSidebar] = useState(false);
  const [search, setSearch]       = useState('');
  const [orders, setOrders]       = useState(MOCK_ORDERS);
  const [parts, setParts]         = useState(MOCK_PARTS);
  const [showAddPart, setShowAddPart] = useState(false);

  const name = localStorage.getItem('name') || 'AutoParts Kenya';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const filteredParts = parts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const pendingOrders   = orders.filter(o => o.status === 'new' || o.status === 'processing');
  const newOrders       = orders.filter(o => o.status === 'new');

  function acceptOrder(id) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'processing' } : o));
  }

  function declineOrder(id) {
    setOrders(prev => prev.filter(o => o.id !== id));
  }

  function markDelivered(id) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'delivered' } : o));
  }

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <div className="sup-wrap">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="sup-overlay" onClick={() => setSidebar(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`sup-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sup-logo">
          <div className="sup-logo-icon">⚙</div>
          <span className="sup-logo-text">GarageConnect</span>
        </div>

        <nav className="sup-nav">
          {NAV.map((item, i) => {
            if (item.section) return (
              <div key={i} className="sup-nav-label">{item.section}</div>
            );
            return (
              <button
                key={item.key}
                className={`sup-nav-item ${active === item.key ? 'active' : ''}`}
                onClick={() => { setActive(item.key); setSidebar(false); }}
              >
                <span className="sup-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge !== null && (
                  <span className={`sup-nav-badge ${item.badgeColor}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sup-sidebar-bottom">
          <div className="sup-user-badge">
            <div className="sup-avatar">{initials}</div>
            <div>
              <div className="sup-user-name">{name}</div>
              <div className="sup-user-role">Supplier · Verified</div>
            </div>
          </div>
          <button className="sup-logout-btn" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="sup-main">
        {/* Topbar */}
        <header className="sup-topbar">
          <button className="sup-hamburger" onClick={() => setSidebar(o => !o)}>
            <span className={`h-line ${sidebarOpen ? 'open-1' : ''}`} />
            <span className={`h-line ${sidebarOpen ? 'open-2' : ''}`} />
            <span className={`h-line ${sidebarOpen ? 'open-3' : ''}`} />
          </button>
          <div className="sup-topbar-left">
            <div className="sup-topbar-title">
              {active === 'dashboard'  && 'Supplier Dashboard'}
              {active === 'orders'     && 'Orders'}
              {active === 'parts'      && 'My Parts'}
              {active === 'lowstock'   && 'Low Stock Alerts'}
              {active === 'pricing'    && 'Pricing'}
              {active === 'revenue'    && 'Revenue'}
              {active === 'garages'    && 'Garages'}
              {active === 'settings'   && 'Settings'}
            </div>
            <div className="sup-topbar-sub">Industrial Area, Nairobi · Verified supplier</div>
          </div>
          <div className="sup-topbar-actions">
            <button className="sup-btn-ghost">📥 Import stock</button>
            <button className="sup-btn-primary" onClick={() => setShowAddPart(true)}>+ Add part</button>
          </div>
        </header>

        {/* ── DASHBOARD VIEW ── */}
        {active === 'dashboard' && (
          <div className="sup-content">
            {/* Stats */}
            <div className="sup-stats">
              <div className="sup-stat">
                <div className="sup-stat-top">
                  <span className="sup-stat-label">Parts listed</span>
                  <div className="sup-stat-icon" style={{ background: 'rgba(232,120,32,0.1)' }}>📦</div>
                </div>
                <div className="sup-stat-value">{parts.length}</div>
                <div className="sup-stat-sub"><span className="trend-up">+8</span> this month</div>
              </div>
              <div className="sup-stat">
                <div className="sup-stat-top">
                  <span className="sup-stat-label">Pending orders</span>
                  <div className="sup-stat-icon" style={{ background: 'rgba(234,179,8,0.1)' }}>🕐</div>
                </div>
                <div className="sup-stat-value" style={{ color: '#eab308' }}>{pendingOrders.length}</div>
                <div className="sup-stat-sub">{newOrders.length} need action</div>
              </div>
              <div className="sup-stat">
                <div className="sup-stat-top">
                  <span className="sup-stat-label">Revenue (June)</span>
                  <div className="sup-stat-icon" style={{ background: 'rgba(34,197,94,0.08)' }}>💰</div>
                </div>
                <div className="sup-stat-value">84.2K</div>
                <div className="sup-stat-sub"><span className="trend-up">+12%</span> vs May</div>
              </div>
              <div className="sup-stat">
                <div className="sup-stat-top">
                  <span className="sup-stat-label">Garages served</span>
                  <div className="sup-stat-icon" style={{ background: 'rgba(232,120,32,0.1)' }}>🏢</div>
                </div>
                <div className="sup-stat-value">37</div>
                <div className="sup-stat-sub"><span className="trend-up">+4</span> this month</div>
              </div>
            </div>

            {/* 2-col grid */}
            <div className="sup-grid">
              {/* Orders panel */}
              <div className="sup-panel">
                <div className="sup-panel-header">
                  <div>
                    <div className="sup-panel-title">
                      <span className="live-dot" /> Incoming orders
                    </div>
                    <div className="sup-panel-sub">Real-time from garages on the platform</div>
                  </div>
                  <button className="sup-view-all" onClick={() => setActive('orders')}>View all →</button>
                </div>
                {orders.map(order => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onAccept={acceptOrder}
                    onDecline={declineOrder}
                    onDeliver={markDelivered}
                    compact
                  />
                ))}
              </div>

              {/* Inventory panel */}
              <div className="sup-panel">
                <div className="sup-panel-header">
                  <div>
                    <div className="sup-panel-title">Parts catalogue</div>
                    <div className="sup-panel-sub">{parts.length} parts · {parts.filter(p => stockStatus(p.stock) !== 'ok').length} stock alerts</div>
                  </div>
                  <button className="sup-view-all" onClick={() => setActive('parts')}>Manage →</button>
                </div>
                <div className="sup-search-bar">
                  <span className="search-icon">🔍</span>
                  <input
                    placeholder="Search parts..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                {filteredParts.slice(0, 6).map(part => (
                  <PartRow key={part.id} part={part} />
                ))}
                <div className="sup-add-row">
                  <button className="sup-add-part-btn" onClick={() => setShowAddPart(true)}>
                    + Add new part to catalogue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS VIEW ── */}
        {active === 'orders' && (
          <div className="sup-content">
            <div className="sup-panel" style={{ maxWidth: '100%' }}>
              <div className="sup-panel-header">
                <div>
                  <div className="sup-panel-title"><span className="live-dot" /> All orders</div>
                  <div className="sup-panel-sub">{orders.length} orders · {pendingOrders.length} pending</div>
                </div>
                <div className="sup-filter-row">
                  {['all', 'new', 'processing', 'delivered'].map(f => (
                    <span key={f} className="sup-filter-chip">{f.charAt(0).toUpperCase() + f.slice(1)}</span>
                  ))}
                </div>
              </div>
              {orders.map(order => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onAccept={acceptOrder}
                  onDecline={declineOrder}
                  onDeliver={markDelivered}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── PARTS VIEW ── */}
        {(active === 'parts' || active === 'lowstock') && (
          <div className="sup-content">
            <div className="sup-panel" style={{ maxWidth: '100%' }}>
              <div className="sup-panel-header">
                <div>
                  <div className="sup-panel-title">
                    {active === 'lowstock' ? '⚠️ Low stock alerts' : 'Parts catalogue'}
                  </div>
                  <div className="sup-panel-sub">
                    {active === 'lowstock'
                      ? `${parts.filter(p => stockStatus(p.stock) !== 'ok').length} items need restocking`
                      : `${parts.length} parts listed`}
                  </div>
                </div>
                <button className="sup-btn-primary" onClick={() => setShowAddPart(true)}>+ Add part</button>
              </div>
              <div className="sup-search-bar" style={{ margin: '12px 16px' }}>
                <span className="search-icon">🔍</span>
                <input
                  placeholder="Search parts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {(active === 'lowstock'
                ? parts.filter(p => stockStatus(p.stock) !== 'ok')
                : filteredParts
              ).map(part => (
                <PartRow key={part.id} part={part} showEdit />
              ))}
            </div>
          </div>
        )}

        {/* ── PLACEHOLDER VIEWS ── */}
        {['pricing', 'revenue', 'garages', 'settings'].includes(active) && (
          <div className="sup-content">
            <div className="sup-empty-state">
              <div className="sup-empty-icon">
                {active === 'pricing'  && '💰'}
                {active === 'revenue'  && '📊'}
                {active === 'garages'  && '🏢'}
                {active === 'settings' && '⚙️'}
              </div>
              <div className="sup-empty-title">
                {active.charAt(0).toUpperCase() + active.slice(1)} coming soon
              </div>
              <div className="sup-empty-sub">This section is under construction.</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Part Modal ── */}
      {showAddPart && (
        <AddPartModal
          onClose={() => setShowAddPart(false)}
          onSave={(part) => {
            setParts(prev => [...prev, { ...part, id: Date.now() }]);
            setShowAddPart(false);
          }}
        />
      )}
    </div>
  );
}

/* ── Order Row component ── */
function OrderRow({ order, onAccept, onDecline, onDeliver, compact }) {
  const statusMap = {
    new:        { label: 'New',        cls: 'badge-new' },
    processing: { label: 'Processing', cls: 'badge-processing' },
    delivered:  { label: 'Delivered',  cls: 'badge-delivered' },
  };
  const s = statusMap[order.status];

  return (
    <div className="sup-order-row">
      <div className="sup-order-icon">🏢</div>
      <div className="sup-order-body">
        <div className="sup-order-garage">
          {order.garage}
          <span className={`sup-badge ${s.cls}`}>{s.label}</span>
        </div>
        <div className="sup-order-parts">{order.parts}</div>
      </div>
      <div className="sup-order-right">
        <div className="sup-order-amount">{order.amount}</div>
        <div className="sup-order-time">{order.time}</div>
        {!compact && (
          <div className="sup-order-actions">
            {order.status === 'new' && (
              <>
                <button className="sup-action-btn accept" onClick={() => onAccept(order.id)}>Accept</button>
                <button className="sup-action-btn decline" onClick={() => onDecline(order.id)}>Decline</button>
              </>
            )}
            {order.status === 'processing' && (
              <button className="sup-action-btn deliver" onClick={() => onDeliver(order.id)}>Mark delivered</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Part Row component ── */
function PartRow({ part, showEdit }) {
  const status = stockStatus(part.stock);
  const label  = stockLabel(part.stock);
  return (
    <div className="sup-part-row">
      <div>
        <div className="sup-part-name">{part.name}</div>
        <div className="sup-part-cat">{part.category}</div>
      </div>
      <div className="sup-part-right">
        <span className={`sup-stock-pill ${status}`}>{label}</span>
        <span className="sup-part-price">{part.price}</span>
        {showEdit && (
          <button className="sup-edit-btn">Edit</button>
        )}
      </div>
    </div>
  );
}

/* ── Add Part Modal ── */
function AddPartModal({ onClose, onSave }) {
  const [name, setName]         = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice]       = useState('');
  const [stock, setStock]       = useState('');

  const CATEGORIES = ['Engine', 'Brakes', 'Electrical', 'Fluids', 'Body', 'Transmission', 'Suspension', 'Other'];

  const valid = name && category && price && stock;

  const handleSave = () => {
    if (!valid) return;
    onSave({
      name,
      category,
      price: `KES ${parseInt(price).toLocaleString()}`,
      stock: parseInt(stock),
      unit: 'units',
    });
  };

  return (
    <div className="sup-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sup-modal">
        <div className="sup-modal-glow" />
        <div className="sup-modal-title">Add a part</div>
        <div className="sup-modal-sub">New item will appear in your public catalogue</div>

        <div className="sup-modal-field">
          <label>Part name *</label>
          <input placeholder="e.g. Brake pads (Toyota Fielder)" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="sup-modal-field">
          <label>Category *</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="sup-modal-row2">
          <div className="sup-modal-field">
            <label>Price (KES) *</label>
            <input type="number" placeholder="e.g. 2400" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="sup-modal-field">
            <label>Stock (units) *</label>
            <input type="number" placeholder="e.g. 50" value={stock} onChange={e => setStock(e.target.value)} />
          </div>
        </div>

        <div className="sup-modal-btns">
          <button className="sup-modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="sup-modal-save"
            onClick={handleSave}
            disabled={!valid}
            style={{
              background: valid ? 'linear-gradient(135deg, #E87820, #cf6a15)' : '#1a1a1a',
              color: valid ? '#fff' : '#444',
              cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            Save part →
          </button>
        </div>
      </div>
    </div>
  );
}