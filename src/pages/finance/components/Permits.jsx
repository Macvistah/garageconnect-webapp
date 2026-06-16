// src/pages/Finance/components/Permits.jsx
import { useState } from 'react';

const MOCK_PERMITS = [
  {
    id: 1,
    name: 'Nairobi County Business Permit',
    type: 'County',
    issueDate: '2026-01-01',
    expiryDate: '2026-12-31',
    cost: 3000,
    status: 'active',
    document: 'permit-2026.pdf',
    reminder: 'Renews December 2026',
  },
  {
    id: 2,
    name: 'NEMA Environmental Levy',
    type: 'National',
    issueDate: '2026-04-01',
    expiryDate: '2026-06-30',
    cost: 2500,
    status: 'expiring',
    document: 'nema-q2-2026.pdf',
    reminder: 'Expires in 14 days',
  },
  {
    id: 3,
    name: 'Fire Safety Certificate',
    type: 'County',
    issueDate: '2025-05-20',
    expiryDate: '2026-05-20',
    cost: 2000,
    status: 'expired',
    document: 'fire-safety-2025.pdf',
    reminder: 'OVERDUE - Renew now',
  },
  {
    id: 4,
    name: 'NTSA Garage Inspection',
    type: 'National',
    issueDate: '2025-08-15',
    expiryDate: '2026-08-15',
    cost: 1500,
    status: 'active',
    document: 'ntsa-inspection-2025.pdf',
    reminder: 'Renews August 2026',
  },
  {
    id: 5,
    name: 'Workers Compensation',
    type: 'National',
    issueDate: '2026-01-15',
    expiryDate: '2026-07-15',
    cost: 4200,
    status: 'active',
    document: 'wc-2026.pdf',
    reminder: 'Renews July 2026',
  },
];

export default function Permits() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Permits', count: MOCK_PERMITS.length },
    { id: 'active', label: 'Active', count: MOCK_PERMITS.filter(p => p.status === 'active').length },
    { id: 'expiring', label: 'Expiring Soon', count: MOCK_PERMITS.filter(p => p.status === 'expiring').length },
    { id: 'expired', label: 'Expired', count: MOCK_PERMITS.filter(p => p.status === 'expired').length },
  ];

  const getPermits = () => {
    if (selectedTab === 'all') return MOCK_PERMITS;
    return MOCK_PERMITS.filter(p => p.status === selectedTab);
  };

  const permits = getPermits();

  const stats = [
    { label: 'Total Permits', value: MOCK_PERMITS.length, icon: '📄', color: 'rgba(59,130,246,0.12)', sub: 'Active licenses' },
    { label: 'Active', value: MOCK_PERMITS.filter(p => p.status === 'active').length, icon: '✅', color: 'rgba(34,197,94,0.12)', sub: 'In compliance' },
    { label: 'Expiring Soon', value: MOCK_PERMITS.filter(p => p.status === 'expiring').length, icon: '⚠️', color: 'rgba(234,179,8,0.12)', sub: 'Action needed' },
    { label: 'Total Cost', value: 'KES 13,200', icon: '💰', color: 'rgba(232,120,32,0.12)', sub: 'Annual licensing' },
  ];

  const getStatusBadge = (status) => {
    const map = {
      active: { label: '✅ Active', class: 'paid' },
      expiring: { label: '⚠️ Expiring Soon', class: 'processing' },
      expired: { label: '❌ Expired', class: 'pending' },
    };
    return map[status] || map.active;
  };

  const getDaysRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Today';
    return `${diff} days left`;
  };

  return (
    <div className="permits-screen">
      {/* ── Stats ── */}
      <div className="finance-stats">
        {stats.map(s => (
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

      {/* ── Filters ── */}
      <div className="finance-filter-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`finance-filter-tab ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
            <span className="finance-filter-count">{tab.count}</span>
          </button>
        ))}
        <div className="finance-filter-search">
          <span>🔍</span>
          <input placeholder="Search permits..." />
        </div>
        <button className="finance-btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowUploadModal(true)}>
          📤 Upload Document
        </button>
      </div>

      {/* ── Permits Grid ── */}
      <div className="permits-grid">
        {permits.length === 0 ? (
          <div className="finance-empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="finance-empty-icon">📭</div>
            <div className="finance-empty-title">No permits</div>
            <div className="finance-empty-sub">No permits in this category</div>
          </div>
        ) : (
          permits.map(p => {
            const status = getStatusBadge(p.status);
            const days = getDaysRemaining(p.expiryDate);
            return (
              <div key={p.id} className="permit-card">
                <div className="permit-card-header">
                  <div className="permit-card-icon">📄</div>
                  <div className="permit-card-status">
                    <span className={`finance-status-badge ${status.class}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="permit-card-name">{p.name}</div>
                <div className="permit-card-type">{p.type} · {p.cost}</div>
                <div className="permit-card-dates">
                  <div>
                    <span className="permit-card-label">Issued</span>
                    <span>{new Date(p.issueDate).toLocaleDateString('en-KE')}</span>
                  </div>
                  <div>
                    <span className="permit-card-label">Expires</span>
                    <span>{new Date(p.expiryDate).toLocaleDateString('en-KE')}</span>
                  </div>
                </div>
                <div className="permit-card-days">{days}</div>
                <div className="permit-card-actions">
                  <button className="finance-table-btn view">📋 View</button>
                  {p.status !== 'active' && (
                    <button className="finance-table-btn pay">🔄 Renew</button>
                  )}
                  <button className="finance-table-btn invoice">📥 Download</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Upload Modal ── */}
      {showUploadModal && (
        <div className="finance-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">📤 Upload Permit Document</div>
            <div className="finance-modal-body">
              <div className="finance-modal-field">
                <label>Permit Name *</label>
                <input className="finance-modal-input" placeholder="e.g. Fire Safety Certificate" />
              </div>

              <div className="finance-modal-field">
                <label>Type *</label>
                <select className="finance-modal-select">
                  <option value="">Select type</option>
                  <option>County</option>
                  <option>National</option>
                </select>
              </div>

              <div className="finance-modal-field">
                <label>Issue Date *</label>
                <input type="date" className="finance-modal-input" />
              </div>

              <div className="finance-modal-field">
                <label>Expiry Date *</label>
                <input type="date" className="finance-modal-input" />
              </div>

              <div className="finance-modal-field">
                <label>Cost (KES)</label>
                <input type="number" className="finance-modal-input" placeholder="e.g. 3000" />
              </div>

              <div className="finance-modal-field">
                <label>Document Upload</label>
                <div className="finance-upload-zone">
                  <span>📁</span>
                  <span>Drag & drop or click to upload</span>
                  <span className="finance-upload-sub">PDF, JPEG, PNG (Max 5MB)</span>
                </div>
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="finance-modal-btn save" onClick={() => {
                alert('✅ Document uploaded successfully!');
                setShowUploadModal(false);
              }}>
                📤 Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}