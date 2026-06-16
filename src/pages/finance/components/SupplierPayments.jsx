// src/pages/Finance/components/SupplierPayments.jsx
import { useState } from 'react';

const MOCK_PAYMENTS = [
  {
    id: 1,
    supplier: 'AutoParts Kenya',
    orderRef: 'PO-2026-1042',
    amount: 9600,
    date: '2026-06-16',
    method: 'M-Pesa',
    status: 'processing',
    invoice: 'INV-2026-1042',
  },
  {
    id: 2,
    supplier: 'Mombasa Spares',
    orderRef: 'PO-2026-1041',
    amount: 5100,
    date: '2026-06-14',
    method: 'Bank Transfer',
    status: 'completed',
    invoice: 'INV-2026-1041',
  },
  {
    id: 3,
    supplier: 'Nakuru Auto',
    orderRef: 'PO-2026-1040',
    amount: 8200,
    date: '2026-06-12',
    method: 'Cash',
    status: 'completed',
    invoice: 'INV-2026-1040',
  },
  {
    id: 4,
    supplier: 'AutoParts Kenya',
    orderRef: 'PO-2026-1039',
    amount: 3200,
    date: '2026-06-10',
    method: 'M-Pesa',
    status: 'completed',
    invoice: 'INV-2026-1039',
  },
  {
    id: 5,
    supplier: 'Mombasa Spares',
    orderRef: 'PO-2026-1038',
    amount: 16800,
    date: '2026-06-08',
    method: 'Bank Transfer',
    status: 'completed',
    invoice: 'INV-2026-1038',
  },
  {
    id: 6,
    supplier: 'Nairobi Tyres',
    orderRef: 'PO-2026-1037',
    amount: 12400,
    date: '2026-06-05',
    method: 'M-Pesa',
    status: 'failed',
    invoice: 'INV-2026-1037',
  },
];

export default function SupplierPayments() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Payments', count: MOCK_PAYMENTS.length },
    { id: 'completed', label: 'Completed', count: MOCK_PAYMENTS.filter(p => p.status === 'completed').length },
    { id: 'processing', label: 'Processing', count: MOCK_PAYMENTS.filter(p => p.status === 'processing').length },
    { id: 'failed', label: 'Failed', count: MOCK_PAYMENTS.filter(p => p.status === 'failed').length },
  ];

  const getPayments = () => {
    if (selectedTab === 'all') return MOCK_PAYMENTS;
    return MOCK_PAYMENTS.filter(p => p.status === selectedTab);
  };

  const payments = getPayments();

  const stats = [
    { label: 'Total Payments', value: MOCK_PAYMENTS.length, icon: '💳', color: 'rgba(59,130,246,0.12)', sub: 'This month' },
    { label: 'Total Amount', value: 'KES 55,300', icon: '💰', color: 'rgba(232,120,32,0.12)', sub: 'All payments' },
    { label: 'Pending/Processing', value: MOCK_PAYMENTS.filter(p => p.status === 'processing' || p.status === 'failed').length, icon: '⏳', color: 'rgba(234,179,8,0.12)', sub: 'Need attention' },
    { label: 'Avg Payment', value: 'KES 9,217', icon: '📊', color: 'rgba(34,197,94,0.12)', sub: 'Per transaction' },
  ];

  const getStatusBadge = (status) => {
    const map = {
      completed: { label: '✅ Completed', class: 'paid' },
      processing: { label: '🔄 Processing', class: 'processing' },
      failed: { label: '❌ Failed', class: 'pending' },
    };
    return map[status] || map.processing;
  };

  const getMethodIcon = (method) => {
    const map = {
      'M-Pesa': '📱',
      'Bank Transfer': '🏦',
      'Cash': '💵',
      'Cheque': '📝',
    };
    return map[method] || '💳';
  };

  return (
    <div className="payments-screen">
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
          <input placeholder="Search payments..." />
        </div>
        <button className="finance-btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowPaymentModal(true)}>
          💰 New Payment
        </button>
      </div>

      {/* ── Payments Table ── */}
      <div className="finance-table-wrap">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Payment #</th>
              <th>Supplier</th>
              <th>Order Ref</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="finance-empty-cell">
                  <div className="finance-empty-state">
                    <div className="finance-empty-icon">📭</div>
                    <div className="finance-empty-title">No payments</div>
                    <div className="finance-empty-sub">No payments in this category</div>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map(p => {
                const status = getStatusBadge(p.status);
                return (
                  <tr key={p.id}>
                    <td className="finance-cell-id">#PY-{String(p.id).padStart(4, '0')}</td>
                    <td>{p.supplier}</td>
                    <td>{p.orderRef}</td>
                    <td className="finance-cell-amount">KES {p.amount.toLocaleString()}</td>
                    <td>{new Date(p.date).toLocaleDateString('en-KE')}</td>
                    <td>
                      <span className="finance-method-badge">
                        {getMethodIcon(p.method)} {p.method}
                      </span>
                    </td>
                    <td>
                      <span className={`finance-status-badge ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="finance-cell-actions">
                        <button className="finance-table-btn view">
                          📋 View
                        </button>
                        {p.status === 'failed' && (
                          <button className="finance-table-btn pay">
                            🔄 Retry
                          </button>
                        )}
                        {p.status === 'processing' && (
                          <button className="finance-table-btn pay">
                            🔄 Check
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── New Payment Modal ── */}
      {showPaymentModal && (
        <div className="finance-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">💰 New Supplier Payment</div>
            <div className="finance-modal-body">
              <div className="finance-modal-field">
                <label>Supplier *</label>
                <select className="finance-modal-select">
                  <option value="">Select supplier</option>
                  <option>AutoParts Kenya</option>
                  <option>Mombasa Spares</option>
                  <option>Nakuru Auto</option>
                  <option>Nairobi Tyres</option>
                </select>
              </div>

              <div className="finance-modal-field">
                <label>Order Reference *</label>
                <input className="finance-modal-input" placeholder="e.g. PO-2026-1043" />
              </div>

              <div className="finance-modal-field">
                <label>Amount (KES) *</label>
                <input type="number" className="finance-modal-input" placeholder="e.g. 5000" />
              </div>

              <div className="finance-modal-field">
                <label>Payment Method *</label>
                <select className="finance-modal-select">
                  <option>M-Pesa</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                </select>
              </div>

              <div className="finance-modal-field">
                <label>Payment Date</label>
                <input type="date" className="finance-modal-input" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="finance-modal-field">
                <label>Notes</label>
                <textarea className="finance-modal-textarea" placeholder="Add payment notes..." rows={2} />
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="finance-modal-btn save" onClick={() => {
                alert('✅ Payment initiated successfully!');
                setShowPaymentModal(false);
              }}>
                💰 Send Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}