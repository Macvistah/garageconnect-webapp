import { useState } from 'react';
import AddVehicleModal from '../../components/AddVehicleModal';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/CustomerDashboard.css';

const NAV = [
  { icon: '▦',  label: 'Overview',       id: 'overview'  },
  { icon: '🚗', label: 'My vehicles',     id: 'vehicles'  },
  { icon: '🔧', label: 'Active repairs',  id: 'repairs'   },
  { icon: '📋', label: 'Service history', id: 'history'   },
  { icon: '🏪', label: 'Nearby garages',  id: 'garages'   },
  { icon: '📦', label: 'Parts requests',  id: 'parts'     },
];

// Sample data — will come from API later
const SAMPLE_VEHICLES = [
  {
    id: 1,
    name: 'Toyota Fielder',
    plate: 'KBZ 123A',
    year: 2018,
    color: 'Silver',
    mileage: '48,200 km',
    status: 'in-repair',
    history: [
      { work: 'Brake fluid replacement', cost: 'KES 2,800', date: 'Today' },
      { work: 'Full service — oil, filter', cost: 'KES 6,500', date: '12 Jun' },
      { work: 'Battery replacement', cost: 'KES 8,200', date: '3 Mar' },
    ],
    totalSpent: 'KES 17,500',
    repairs: 3,
  },
  {
    id: 2,
    name: 'Subaru Forester',
    plate: 'KDA 456B',
    year: 2016,
    color: 'Blue',
    mileage: '72,000 km',
    status: 'ok',
    history: [
      { work: 'Tyre rotation & balance', cost: 'KES 1,200', date: '20 May' },
      { work: 'Air filter replacement', cost: 'KES 900', date: '2 Feb' },
    ],
    totalSpent: 'KES 2,100',
    repairs: 2,
  },
];

const ACTIVE_REPAIR = {
  vehicle: 'Toyota Fielder · KBZ 123A',
  garage: 'Ruiru Auto Centre',
  mechanic: 'John Kamau',
  description: 'Brake fluid replacement + pads inspection',
  status: 'in_progress',
  costSoFar: 'KES 2,800',
  steps: [
    { label: 'Received',  state: 'done'    },
    { label: 'Diagnosed', state: 'done'    },
    { label: 'In repair', state: 'active'  },
    { label: 'Parts',     state: 'pending' },
    { label: 'Done',      state: 'pending' },
  ],
  partsNeeded: ['Brake pads (front)', 'Brake fluid 1L'],
};

const NEARBY_GARAGES = [
  { id: 1, name: 'Ruiru Auto Centre',  dist: '0.8 km', open: true,  rating: 4.8, services: 'Engine, electrical, brakes' },
  { id: 2, name: 'Thika Road Motors',  dist: '1.4 km', open: true,  rating: 4.5, services: 'Full service, tyres' },
  { id: 3, name: 'Kasarani Garage',    dist: '2.1 km', open: false, rating: 4.2, services: 'Tyres, brakes, suspension' },
];

export default function CustomerDashboard() {
  const navigate  = useNavigate();
  const [active, setActive]         = useState('overview');
  const [sidebarOpen, setSidebar]   = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicles, setVehicles]     = useState(SAMPLE_VEHICLES);

  const name     = localStorage.getItem('name') || 'Mac Kelvin';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const showOverview = active === 'overview';
  const showVehicles = active === 'vehicles' || active === 'overview';
  const showRepairs  = active === 'repairs'  || active === 'overview';
  const showGarages  = active === 'garages'  || active === 'overview';
  const showParts    = active === 'parts'    || active === 'overview';

  return (
    <div className="customer-dashboard">

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebar(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49 }} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`customer-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="cs-logo">
          <div className="cs-logo-icon">⚙</div>
          <span className="cs-logo-text">GarageConnect</span>
        </Link>

        <div className="cs-nav">
          <div className="cs-nav-label">Menu</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`cs-nav-link ${active === item.id ? 'active' : ''}`}
              onClick={() => { setActive(item.id); setSidebar(false); }}
            >
              <span className="cs-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="cs-sidebar-bottom">
          <div className="cs-user-badge">
            <div className="cs-user-avatar">{initials}</div>
            <div>
              <div className="cs-user-name">{name}</div>
              <div className="cs-user-role">Car owner</div>
            </div>
          </div>
          <button className="cs-nav-link" onClick={logout}>
            <span className="cs-nav-icon">🚪</span> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="customer-main">

        {/* Topbar */}
        <div className="customer-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebar(o => !o)}
              style={{ display: 'none', background: 'none', border: 'none', color: '#aaa', fontSize: 20, cursor: 'pointer' }}
              className="sidebar-toggle">☰</button>
            <div className="topbar-left">
              <h2>{NAV.find(n => n.id === active)?.label || 'Overview'}</h2>
              <p>Welcome back, {name.split(' ')[0]}</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn-secondary" onClick={() => setActive('garages')}>
              🔍 Find garage
            </button>
            <button className="btn-primary" onClick={() => setShowAddVehicle(true)}>
              + Add vehicle
            </button>
          </div>
        </div>

        <div className="customer-content">

          {/* Stats */}
          {showOverview && (
            <div className="cs-stats">
              {[
                { label: 'My vehicles',    value: vehicles.length,   icon: '🚗', bg: 'rgba(59,130,246,0.12)',   sub: 'Registered' },
                { label: 'Total repairs',  value: vehicles.reduce((a,v) => a + v.repairs, 0), icon: '🔧', bg: 'rgba(232,120,32,0.12)', sub: 'All time' },
                { label: 'Active repairs', value: vehicles.filter(v => v.status === 'in-repair').length, icon: '⚡', bg: 'rgba(234,179,8,0.12)', sub: 'Right now' },
                { label: 'Nearby garages', value: NEARBY_GARAGES.filter(g => g.open).length, icon: '🏪', bg: 'rgba(34,197,94,0.12)', sub: 'Open now' },
              ].map(s => (
                <div key={s.label} className="cs-stat">
                  <div className="cs-stat-top">
                    <span className="cs-stat-label">{s.label}</span>
                    <div className="cs-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                  </div>
                  <div className="cs-stat-value">{s.value}</div>
                  <div className="cs-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* Active repair banner */}
          {(showRepairs) && (
            <div className="cs-section">
              {showOverview && (
                <div className="cs-section-header">
                  <div>
                    <div className="cs-section-title">Active repair</div>
                    <div className="cs-section-sub">Real-time update from your mechanic</div>
                  </div>
                </div>
              )}
              <div className="active-repair-banner">
                <div className="arb-left">
                  <div className="arb-badge">
                    <div className="arb-pulse" />
                    Live update
                  </div>
                  <div className="arb-title">{ACTIVE_REPAIR.description}</div>
                  <div className="arb-garage">
                    {ACTIVE_REPAIR.garage} · Mechanic: {ACTIVE_REPAIR.mechanic}
                  </div>
                  <div className="arb-vehicle" style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
                    {ACTIVE_REPAIR.vehicle}
                  </div>

                  {/* Progress steps */}
                  <div className="arb-progress">
                    <div className="arb-progress-steps">
                      {ACTIVE_REPAIR.steps.map((step, i) => (
                        <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="arb-step">
                            <div className={`arb-step-dot ${step.state}`}>
                              {step.state === 'done' ? '✓' : i + 1}
                            </div>
                            <span className={`arb-step-label ${step.state}`}>{step.label}</span>
                          </div>
                          {i < ACTIVE_REPAIR.steps.length - 1 && (
                            <div className={`arb-step-line ${step.state === 'done' ? 'done' : ''}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parts needed */}
                  <div className="arb-parts">
                    <span className="arb-parts-label">Parts needed:</span>
                    {ACTIVE_REPAIR.partsNeeded.map(p => (
                      <span key={p} className="arb-part-badge">{p}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="arb-cost">{ACTIVE_REPAIR.costSoFar}</div>
                  <div className="arb-cost-label">Cost so far</div>
                  <button className="btn-secondary" style={{ marginTop: 16, fontSize: 12 }}>
                    View details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* My vehicles */}
          {showVehicles && (
            <div className="cs-section">
              <div className="cs-section-header">
                <div>
                  <div className="cs-section-title">My vehicles</div>
                  <div className="cs-section-sub">{vehicles.length} registered</div>
                </div>
                <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}
                  onClick={() => setShowAddVehicle(true)}>
                  + Add vehicle
                </button>
              </div>

              <div className="vehicles-grid">
                {vehicles.map(v => (
                  <div key={v.id} className={`vehicle-card ${v.status === 'in-repair' ? 'active-job' : ''}`}>
                    <div className="vehicle-card-header">
                      <div className="vehicle-icon">🚗</div>
                      <div>
                        <div className="vehicle-name">{v.name}</div>
                        <div className="vehicle-plate">{v.plate}</div>
                      </div>
                      <div className={`vehicle-status ${v.status}`}>
                        {v.status === 'in-repair' ? '🔧 In repair' : '✓ Good'}
                      </div>
                    </div>

                    <div className="vehicle-card-body">
                      <div className="vehicle-stats">
                        {[
                          ['Year',     v.year     || '—'],
                          ['Color',    v.color    || '—'],
                          ['Mileage',  v.mileage  || '—'],
                          ['Repairs',  v.repairs],
                        ].map(([label, val]) => (
                          <div key={label} className="vehicle-stat-item">
                            <div className="vehicle-stat-label">{label}</div>
                            <div className="vehicle-stat-value">{val}</div>
                          </div>
                        ))}
                      </div>

                      {v.history.length > 0 && (
                        <div className="vehicle-history-preview">
                          <div className="vhp-title">Recent repairs</div>
                          {v.history.slice(0, 2).map((h, i) => (
                            <div key={i} className="vhp-item">
                              <div>
                                <div className="vhp-work">{h.work}</div>
                                <div className="vhp-date">{h.date}</div>
                              </div>
                              <div className="vhp-cost">{h.cost}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="vehicle-card-footer">
                      <button className="vc-btn">📋 History</button>
                      <button className="vc-btn primary">🔧 Request service</button>
                    </div>
                  </div>
                ))}

                {/* Add vehicle card */}
                <div className="vehicle-card-add" onClick={() => setShowAddVehicle(true)}>
                  <div className="add-icon">+</div>
                  <div className="add-label">Add a vehicle</div>
                </div>
              </div>
            </div>
          )}

          {/* Nearby garages */}
          {showGarages && (
            <div className="cs-section">
              <div className="cs-section-header">
                <div>
                  <div className="cs-section-title">Nearby garages</div>
                  <div className="cs-section-sub">Based on your location</div>
                </div>
                <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setActive('garages')}>
                  View all
                </button>
              </div>
              <div className="nearby-grid">
                {NEARBY_GARAGES.map(g => (
                  <div key={g.id} className="nearby-card">
                    <div className="nearby-card-top">
                      <div className="nearby-name">{g.name}</div>
                      <div className="nearby-dist">{g.dist}</div>
                    </div>
                    <div className="nearby-status">
                      <div className={`nearby-dot ${g.open ? 'open' : 'closed'}`} />
                      <span className={g.open ? 'nearby-open' : 'nearby-closed'}>
                        {g.open ? 'Open' : 'Closed'}
                      </span>
                      · {g.services.split(',')[0]}
                    </div>
                    <div className="nearby-services">{g.services}</div>
                    <div className="nearby-rating">{'★'.repeat(Math.floor(g.rating))} {g.rating}</div>
                    {g.open && (
                      <button className="nearby-request-btn">Request service →</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parts requests */}
          {showParts && (
            <div className="cs-section">
              <div className="cs-section-header">
                <div>
                  <div className="cs-section-title">Parts being sourced</div>
                  <div className="cs-section-sub">For your active repair</div>
                </div>
              </div>
              <div style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: 10, overflow: 'hidden' }}>
                {ACTIVE_REPAIR.partsNeeded.map((part, i) => (
                  <div key={part} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 20px', borderBottom: i < ACTIVE_REPAIR.partsNeeded.length - 1 ? '0.5px solid #161616' : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#fff', marginBottom: 3 }}>{part}</div>
                      <div style={{ fontSize: 12, color: '#555' }}>Requested by mechanic · Toyota Fielder</div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: 'rgba(234,179,8,0.1)', color: '#eab308',
                      border: '0.5px solid rgba(234,179,8,0.2)',
                    }}>
                      ⏳ Being ordered
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Add vehicle modal ── */}
      {showAddVehicle && (
        <AddVehicleModal
          onClose={() => setShowAddVehicle(false)}
          onSave={(vehicle) => {
            setVehicles(v => [...v, { id: Date.now(), ...vehicle }]);
            setShowAddVehicle(false);
          }}
        />
      )}

    </div>
  );
}

// Modal is now handled by AddVehicleModal component
