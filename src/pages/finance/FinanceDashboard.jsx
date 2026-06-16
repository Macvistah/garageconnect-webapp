// src/pages/Finance/FinanceDashboard.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApprovalsQueue from './components/ApprovalsQueue';
import './styles/FinanceDashboard.css';

const NAV = [
  { section: 'Main' },
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '✅', label: 'Approvals', id: 'approvals', badge: 3, badgeColor: 'orange' },
  { icon: '🛒', label: 'Parts Purchases', id: 'purchases' },
  { section: 'Finance' },
  { icon: '👨‍🔧', label: 'Payroll', id: 'payroll' },
  { icon: '💡', label: 'Overheads', id: 'overheads' },
  { icon: '🏦', label: 'Supplier Payments', id: 'payments' },
  { section: 'Compliance' },
  { icon: '📋', label: 'KRA / PAYE', id: 'kra' },
  { icon: '🛡️', label: 'NSSF & SHA', id: 'nssf' },
  { icon: '📄', label: 'Permits & Licensing', id: 'permits' },
  { section: 'Reports' },
  { icon: '📊', label: 'Monthly Report', id: 'reports' },
];

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('approvals');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const name = localStorage.getItem('name') || 'Grace Muthoni';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const logout = () => { localStorage.clear(); navigate('/login'); };

  // ─── Overview Stats ───
  const overviewStats = [
    { label: 'Pending Approvals', value: 3, icon: '⏳', color: 'rgba(234,179,8,0.12)', sub: 'Needs your action' },
    { label: 'Approved This Month', value: 12, icon: '✅', color: 'rgba(34,197,94,0.12)', sub: 'KES 87,400' },
    { label: 'Rejected', value: 2, icon: '❌', color: 'rgba(239,68,68,0.12)', sub: 'KES 12,800 saved' },
    { label: 'Avg. Approval Time', value: '4.2h', icon: '⏱️', color: 'rgba(59,130,246,0.12)', sub: '-12% vs last month' },
  ];

  const pendingRequests = [
    { id: 1, part: 'Brake pads (Toyota Fielder)', mechanic: 'John Kamau', car: 'KBZ 123A', time: '2 hours ago', total: 'KES 9,600', urgent: true },
    { id: 2, part: 'Oil filter (5L)', mechanic: 'Sarah Wanjiru', car: 'KDA 456B', time: '4 hours ago', total: 'KES 5,100', urgent: false },
    { id: 3, part: 'Alternator belt', mechanic: 'Peter Ochieng', car: 'KBZ 789C', time: '1 day ago', total: 'KES 8,200', urgent: false },
  ];

  const renderContent = () => {
    switch (active) {
      case 'approvals': return <ApprovalsQueue />;
      // Other screens will be added here later
      default: return (
        <>
          {/* ── Overview Stats ── */}
          <div className="finance-stats">
            {overviewStats.map(s => (
              <div key={s.label} className="finance-stat">
                <div className="finance-stat-top">
                  <span className="finance-stat-label">{s.label}</span>
                  <div className="finance-stat-icon" style={{ background: s.color }}>{s.icon}</div>
                </div>
                <div className="finance-stat-value">{s.value}</div>
                <div className="finance-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Summary Cards ── */}
          <div className="finance-summary-grid">
            <div className="finance-summary-card">
              <div className="finance-summary-title">💰 Cash Balance</div>
              <div className="finance-summary-value">KES 142,000</div>
              <div className="finance-summary-change up">↑ 12% from last month</div>
            </div>
            <div className="finance-summary-card">
              <div className="finance-summary-title">📦 Parts Spend</div>
              <div className="finance-summary-value">KES 87,400</div>
              <div className="finance-summary-change down">↑ 8% from last month</div>
            </div>
            <div className="finance-summary-card">
              <div className="finance-summary-title">👨‍🔧 Payroll</div>
              <div className="finance-summary-value">KES 181,000</div>
              <div className="finance-summary-change up">↑ 3% from last month</div>
            </div>
            <div className="finance-summary-card">
              <div className="finance-summary-title">💡 Overheads</div>
              <div className="finance-summary-value">KES 52,300</div>
              <div className="finance-summary-change down">↓ 5% from last month</div>
            </div>
          </div>

          {/* ── Pending Approvals Preview ── */}
          <div className="finance-section">
            <div className="finance-section-header">
              <div>
                <div className="finance-section-title">⏳ Pending Approvals</div>
                <div className="finance-section-sub">{pendingRequests.length} requests waiting for your decision</div>
              </div>
              <button className="finance-view-all" onClick={() => setActive('approvals')}>
                View all →
              </button>
            </div>

            <div className="finance-preview-list">
              {pendingRequests.map(req => (
                <div key={req.id} className="finance-preview-item">
                  <div className="finance-preview-left">
                    <div className="finance-preview-part">{req.part}</div>
                    <div className="finance-preview-meta">
                      <span>🔧 {req.mechanic}</span>
                      <span>🚗 {req.car}</span>
                      <span>⏱️ {req.time}</span>
                    </div>
                  </div>
                  <div className="finance-preview-right">
                    <div className="finance-preview-amount">{req.total}</div>
                    {req.urgent && <span className="finance-urgent-badge">🚨 Urgent</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="finance-quick-actions">
            <button className="finance-quick-btn">👨‍🔧 Process Payroll</button>
            <button className="finance-quick-btn">💡 Add Bill</button>
            <button className="finance-quick-btn">🏦 Pay Supplier</button>
            <button className="finance-quick-btn">📊 Generate Report</button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="finance-dashboard">

      {/* ── Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="finance-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`finance-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="finance-logo">
          <div className="finance-logo-icon">⚙</div>
          <span className="finance-logo-text">GarageConnect</span>
        </Link>

        <nav className="finance-nav">
          {NAV.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className="finance-nav-label">{item.section}</div>
              );
            }
            return (
              <button
                key={item.id}
                className={`finance-nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              >
                <span className="finance-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className={`finance-nav-badge ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="finance-sidebar-bottom">
          <div className="finance-user-badge">
            <div className="finance-user-avatar">{initials}</div>
            <div>
              <div className="finance-user-name">{name}</div>
              <div className="finance-user-role">Finance Manager</div>
            </div>
          </div>
          <button className="finance-logout-btn" onClick={logout}>🚪 Sign out</button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="finance-main">

        {/* ── Top Bar ── */}
        <header className="finance-topbar">
          <button className="finance-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className={`h-line ${sidebarOpen ? 'open-1' : ''}`} />
            <span className={`h-line ${sidebarOpen ? 'open-2' : ''}`} />
            <span className={`h-line ${sidebarOpen ? 'open-3' : ''}`} />
          </button>

          <div className="finance-topbar-left">
            <div className="finance-topbar-title">
              {active === 'overview' && 'Finance Dashboard'}
              {active === 'approvals' && 'Approvals Queue'}
              {active === 'purchases' && 'Parts Purchases'}
              {active === 'payroll' && 'Payroll'}
              {active === 'overheads' && 'Overheads'}
              {active === 'payments' && 'Supplier Payments'}
              {active === 'kra' && 'KRA / PAYE'}
              {active === 'nssf' && 'NSSF & SHA'}
              {active === 'permits' && 'Permits & Licensing'}
              {active === 'reports' && 'Monthly Report'}
            </div>
            <div className="finance-topbar-sub">
              Ruiru Auto Centre · {new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="finance-topbar-actions">
            <button className="finance-btn-ghost">
              <span>📅</span> Filter
            </button>
            <button className="finance-btn-ghost">
              <span>📤</span> Export
            </button>
            <button className="finance-btn-primary">
              <span>💰</span> New Payment
            </button>
          </div>
        </header>

        {/* ── Content Area ── */}
        <div className="finance-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}