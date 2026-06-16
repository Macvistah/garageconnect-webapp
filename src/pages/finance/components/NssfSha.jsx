// src/pages/Finance/components/NssfSha.jsx
import { useState } from 'react';

const MOCK_CONTRIBUTIONS = [
  {
    id: 1,
    employee: 'John Kamau',
    nssfTier1: 600,
    nssfTier2: 600,
    nssfEmployer: 1200,
    shaEmployee: 2079,
    shaEmployer: 2079,
    total: 6558,
    month: 'June 2026',
    status: 'remitted',
  },
  {
    id: 2,
    employee: 'Sarah Wanjiru',
    nssfTier1: 600,
    nssfTier2: 600,
    nssfEmployer: 1200,
    shaEmployee: 1874,
    shaEmployer: 1874,
    total: 6148,
    month: 'June 2026',
    status: 'remitted',
  },
  {
    id: 3,
    employee: 'Peter Ochieng',
    nssfTier1: 600,
    nssfTier2: 600,
    nssfEmployer: 1200,
    shaEmployee: 1802,
    shaEmployer: 1802,
    total: 6004,
    month: 'June 2026',
    status: 'pending',
  },
  {
    id: 4,
    employee: 'Mary Akinyi',
    nssfTier1: 600,
    nssfTier2: 600,
    nssfEmployer: 1200,
    shaEmployee: 1320,
    shaEmployer: 1320,
    total: 5040,
    month: 'June 2026',
    status: 'pending',
  },
  {
    id: 5,
    employee: 'David Mwangi',
    nssfTier1: 600,
    nssfTier2: 600,
    nssfEmployer: 1200,
    shaEmployee: 1650,
    shaEmployer: 1650,
    total: 5700,
    month: 'June 2026',
    status: 'remitted',
  },
];

export default function NssfSha() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Contributions', count: MOCK_CONTRIBUTIONS.length },
    { id: 'remitted', label: 'Remitted', count: MOCK_CONTRIBUTIONS.filter(c => c.status === 'remitted').length },
    { id: 'pending', label: 'Pending', count: MOCK_CONTRIBUTIONS.filter(c => c.status === 'pending').length },
  ];

  const getData = () => {
    if (selectedTab === 'all') return MOCK_CONTRIBUTIONS;
    return MOCK_CONTRIBUTIONS.filter(c => c.status === selectedTab);
  };

  const data = getData();

  const totalNSSF = MOCK_CONTRIBUTIONS.reduce((sum, c) => sum + c.nssfTier1 + c.nssfTier2 + c.nssfEmployer, 0);
  const totalSHA = MOCK_CONTRIBUTIONS.reduce((sum, c) => sum + c.shaEmployee + c.shaEmployer, 0);
  const totalAll = MOCK_CONTRIBUTIONS.reduce((sum, c) => sum + c.total, 0);

  const stats = [
    { label: 'Total NSSF', value: `KES ${totalNSSF.toLocaleString()}`, icon: '🏦', color: 'rgba(59,130,246,0.12)', sub: 'Employee + Employer' },
    { label: 'Total SHA', value: `KES ${totalSHA.toLocaleString()}`, icon: '🛡️', color: 'rgba(232,120,32,0.12)', sub: '2.75% Employee + Employer' },
    { label: 'Total Contributions', value: `KES ${totalAll.toLocaleString()}`, icon: '💰', color: 'rgba(34,197,94,0.12)', sub: 'All remittances' },
    { label: 'Remitted', value: MOCK_CONTRIBUTIONS.filter(c => c.status === 'remitted').length, icon: '✅', color: 'rgba(34,197,94,0.12)', sub: 'Up to date' },
  ];

  const getStatusBadge = (status) => {
    return status === 'remitted'
      ? <span className="finance-status-badge paid">✅ Remitted</span>
      : <span className="finance-status-badge pending">⏳ Pending</span>;
  };

  const handleRemitAll = () => {
    alert('✅ All contributions remitted successfully!');
  };

  return (
    <div className="nssf-screen">
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

      {/* ── Compliance Banner ── */}
      <div className="finance-compliance-banner nssf-banner">
        <div className="finance-compliance-icon">📋</div>
        <div className="finance-compliance-content">
          <div className="finance-compliance-title">NSSF & SHA Filing Deadline: 9th of every month</div>
          <div className="finance-compliance-sub">
            {MOCK_CONTRIBUTIONS.filter(c => c.status === 'pending').length} contributions pending remittance
          </div>
        </div>
        <button className="finance-btn-primary" onClick={handleRemitAll}>
          Remit All
        </button>
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
          <input placeholder="Search employee..." />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="finance-table-wrap">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>NSSF Tier I</th>
              <th>NSSF Tier II</th>
              <th>NSSF (Employer)</th>
              <th>SHA (2.75%)</th>
              <th>SHA (Employer)</th>
              <th>Total</th>
              <th>Month</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="9" className="finance-empty-cell">
                  <div className="finance-empty-state">
                    <div className="finance-empty-icon">📭</div>
                    <div className="finance-empty-title">No data</div>
                    <div className="finance-empty-sub">No contributions in this category</div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="finance-cell-employee">
                      <div className="finance-cell-avatar">{c.employee.charAt(0)}</div>
                      <div className="finance-cell-name">{c.employee}</div>
                    </div>
                  </td>
                  <td className="finance-cell-amount">KES {c.nssfTier1.toLocaleString()}</td>
                  <td className="finance-cell-amount">KES {c.nssfTier2.toLocaleString()}</td>
                  <td className="finance-cell-amount">KES {c.nssfEmployer.toLocaleString()}</td>
                  <td className="finance-cell-amount">KES {c.shaEmployee.toLocaleString()}</td>
                  <td className="finance-cell-amount">KES {c.shaEmployer.toLocaleString()}</td>
                  <td className="finance-cell-amount" style={{ color: '#E87820' }}>
                    KES {c.total.toLocaleString()}
                  </td>
                  <td>{c.month}</td>
                  <td>{getStatusBadge(c.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}