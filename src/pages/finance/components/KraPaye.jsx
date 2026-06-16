// src/pages/Finance/components/KraPaye.jsx
import { useState } from 'react';

const MOCK_TAX_DATA = [
  {
    id: 1,
    employee: 'John Kamau',
    pin: 'A123456789B',
    grossPay: 75600,
    taxablePay: 68040,
    kraRate: 5.5,
    kraAmount: 3742,
    helb: 0,
    filingStatus: 'filed',
    filingDate: '2026-06-10',
  },
  {
    id: 2,
    employee: 'Sarah Wanjiru',
    pin: 'C987654321D',
    grossPay: 68160,
    taxablePay: 61344,
    kraRate: 5.5,
    kraAmount: 3374,
    helb: 1500,
    filingStatus: 'filed',
    filingDate: '2026-06-11',
  },
  {
    id: 3,
    employee: 'Peter Ochieng',
    pin: 'E456789012F',
    grossPay: 65520,
    taxablePay: 58968,
    kraRate: 5.5,
    kraAmount: 3243,
    helb: 0,
    filingStatus: 'pending',
    filingDate: null,
  },
  {
    id: 4,
    employee: 'Mary Akinyi',
    pin: 'G234567890H',
    grossPay: 48000,
    taxablePay: 43200,
    kraRate: 5.5,
    kraAmount: 2376,
    helb: 0,
    filingStatus: 'filed',
    filingDate: '2026-06-12',
  },
  {
    id: 5,
    employee: 'David Mwangi',
    pin: 'I345678901J',
    grossPay: 60000,
    taxablePay: 54000,
    kraRate: 5.5,
    kraAmount: 2970,
    helb: 2000,
    filingStatus: 'overdue',
    filingDate: null,
  },
];

export default function KraPaye() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Employees', count: MOCK_TAX_DATA.length },
    { id: 'filed', label: 'Filed', count: MOCK_TAX_DATA.filter(e => e.filingStatus === 'filed').length },
    { id: 'pending', label: 'Pending', count: MOCK_TAX_DATA.filter(e => e.filingStatus === 'pending').length },
    { id: 'overdue', label: 'Overdue', count: MOCK_TAX_DATA.filter(e => e.filingStatus === 'overdue').length },
  ];

  const getData = () => {
    if (selectedTab === 'all') return MOCK_TAX_DATA;
    return MOCK_TAX_DATA.filter(e => e.filingStatus === selectedTab);
  };

  const data = getData();

  const totalKRA = MOCK_TAX_DATA.reduce((sum, e) => sum + e.kraAmount, 0);
  const totalHELB = MOCK_TAX_DATA.reduce((sum, e) => sum + e.helb, 0);

  const stats = [
    { label: 'Total PAYE', value: `KES ${totalKRA.toLocaleString()}`, icon: '📋', color: 'rgba(232,120,32,0.12)', sub: 'KRA taxes' },
    { label: 'Total HELB', value: `KES ${totalHELB.toLocaleString()}`, icon: '🎓', color: 'rgba(59,130,246,0.12)', sub: 'Student loans' },
    { label: 'Filed', value: MOCK_TAX_DATA.filter(e => e.filingStatus === 'filed').length, icon: '✅', color: 'rgba(34,197,94,0.12)', sub: 'Compliant' },
    { label: 'Pending/Overdue', value: MOCK_TAX_DATA.filter(e => e.filingStatus !== 'filed').length, icon: '⚠️', color: 'rgba(234,179,8,0.12)', sub: 'Needs action' },
  ];

  const getStatusBadge = (status) => {
    const map = {
      filed: { label: '✅ Filed', class: 'paid' },
      pending: { label: '⏳ Pending', class: 'processing' },
      overdue: { label: '❌ Overdue', class: 'pending' },
    };
    return map[status] || map.pending;
  };

  const handleFileAll = () => {
    alert('📋 All KRA returns filed successfully!');
  };

  return (
    <div className="kra-screen">
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

      {/* ── Compliance Notice ── */}
      <div className="finance-compliance-banner">
        <div className="finance-compliance-icon">📋</div>
        <div className="finance-compliance-content">
          <div className="finance-compliance-title">KRA Filing Deadline: 20th of every month</div>
          <div className="finance-compliance-sub">
            {MOCK_TAX_DATA.filter(e => e.filingStatus === 'overdue').length} employees have overdue filings
          </div>
        </div>
        <button className="finance-btn-primary" onClick={handleFileAll}>
          File All Returns
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
        <button className="finance-btn-ghost" style={{ marginLeft: 'auto' }}>
          📥 Export CSV
        </button>
      </div>

      {/* ── Table ── */}
      <div className="finance-table-wrap">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>KRA PIN</th>
              <th>Gross Pay</th>
              <th>Taxable Pay</th>
              <th>Rate</th>
              <th>PAYE</th>
              <th>HELB</th>
              <th>Status</th>
              <th>Filing Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="9" className="finance-empty-cell">
                  <div className="finance-empty-state">
                    <div className="finance-empty-icon">📭</div>
                    <div className="finance-empty-title">No data</div>
                    <div className="finance-empty-sub">No employees in this category</div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map(e => {
                const status = getStatusBadge(e.filingStatus);
                return (
                  <tr key={e.id}>
                    <td>
                      <div className="finance-cell-employee">
                        <div className="finance-cell-avatar">{e.employee.charAt(0)}</div>
                        <div className="finance-cell-name">{e.employee}</div>
                      </div>
                    </td>
                    <td>{e.pin}</td>
                    <td className="finance-cell-amount">KES {e.grossPay.toLocaleString()}</td>
                    <td className="finance-cell-amount">KES {e.taxablePay.toLocaleString()}</td>
                    <td>{e.kraRate}%</td>
                    <td className="finance-cell-amount" style={{ color: '#E87820' }}>
                      KES {e.kraAmount.toLocaleString()}
                    </td>
                    <td>{e.helb > 0 ? `KES ${e.helb.toLocaleString()}` : '—'}</td>
                    <td>
                      <span className={`finance-status-badge ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>{e.filingDate ? new Date(e.filingDate).toLocaleDateString('en-KE') : '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}