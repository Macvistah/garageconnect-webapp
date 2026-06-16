// src/pages/Finance/components/PartsPurchases.jsx
import { useState } from 'react';

const MOCK_PURCHASES = [
  {
    id: 'PO-2026-1042',
    part: 'Brake pads (Toyota Fielder)',
    quantity: 4,
    supplier: 'AutoParts Kenya',
    orderDate: '2026-06-16',
    totalAmount: 'KES 9,600',
    status: 'pending',
    deliveryDate: '2026-06-19',
    paymentMethod: 'M-Pesa',
    mechanic: 'John Kamau',
    car: 'KBZ 123A',
    invoice: 'INV-2026-1042',
    items: [
      { name: 'Brake pads (front)', quantity: 2, unitPrice: 'KES 2,400', total: 'KES 4,800' },
      { name: 'Brake pads (rear)', quantity: 2, unitPrice: 'KES 2,400', total: 'KES 4,800' },
    ],
  },
  {
    id: 'PO-2026-1041',
    part: 'Oil filter (5L)',
    quantity: 6,
    supplier: 'Mombasa Spares',
    orderDate: '2026-06-14',
    totalAmount: 'KES 5,100',
    status: 'processing',
    deliveryDate: '2026-06-17',
    paymentMethod: 'Bank Transfer',
    mechanic: 'Sarah Wanjiru',
    car: 'KDA 456B',
    invoice: 'INV-2026-1041',
    items: [
      { name: 'Oil filter 5L', quantity: 6, unitPrice: 'KES 850', total: 'KES 5,100' },
    ],
  },
  {
    id: 'PO-2026-1040',
    part: 'Alternator belt',
    quantity: 1,
    supplier: 'Nakuru Auto',
    orderDate: '2026-06-12',
    totalAmount: 'KES 8,200',
    status: 'delivered',
    deliveryDate: '2026-06-15',
    paymentMethod: 'Cash',
    mechanic: 'Peter Ochieng',
    car: 'KBZ 789C',
    invoice: 'INV-2026-1040',
    items: [
      { name: 'Alternator belt', quantity: 1, unitPrice: 'KES 8,200', total: 'KES 8,200' },
    ],
  },
  {
    id: 'PO-2026-1039',
    part: 'Spark plugs (NGK) ×4',
    quantity: 4,
    supplier: 'AutoParts Kenya',
    orderDate: '2026-06-10',
    totalAmount: 'KES 3,200',
    status: 'paid',
    deliveryDate: '2026-06-12',
    paymentMethod: 'M-Pesa',
    mechanic: 'Sarah Wanjiru',
    car: 'KDA 456B',
    invoice: 'INV-2026-1039',
    items: [
      { name: 'NGK Spark plugs ×4', quantity: 4, unitPrice: 'KES 800', total: 'KES 3,200' },
    ],
  },
  {
    id: 'PO-2026-1038',
    part: 'Engine oil 5L ×6',
    quantity: 6,
    supplier: 'Mombasa Spares',
    orderDate: '2026-06-08',
    totalAmount: 'KES 16,800',
    status: 'paid',
    deliveryDate: '2026-06-10',
    paymentMethod: 'Bank Transfer',
    mechanic: 'John Kamau',
    car: 'KBZ 123A',
    invoice: 'INV-2026-1038',
    items: [
      { name: 'Engine oil 5L', quantity: 6, unitPrice: 'KES 2,800', total: 'KES 16,800' },
    ],
  },
];

const MOCK_INVOICES = [
  {
    id: 'INV-2026-1042',
    poId: 'PO-2026-1042',
    supplier: 'AutoParts Kenya',
    issueDate: '2026-06-16',
    dueDate: '2026-06-30',
    amount: 'KES 9,600',
    status: 'pending',
  },
  {
    id: 'INV-2026-1041',
    poId: 'PO-2026-1041',
    supplier: 'Mombasa Spares',
    issueDate: '2026-06-14',
    dueDate: '2026-06-28',
    amount: 'KES 5,100',
    status: 'paid',
  },
  {
    id: 'INV-2026-1040',
    poId: 'PO-2026-1040',
    supplier: 'Nakuru Auto',
    issueDate: '2026-06-12',
    dueDate: '2026-06-26',
    amount: 'KES 8,200',
    status: 'paid',
  },
];

export default function PartsPurchases() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Orders', count: MOCK_PURCHASES.length },
    { id: 'pending', label: 'Pending', count: MOCK_PURCHASES.filter(p => p.status === 'pending').length },
    { id: 'processing', label: 'Processing', count: MOCK_PURCHASES.filter(p => p.status === 'processing').length },
    { id: 'delivered', label: 'Delivered', count: MOCK_PURCHASES.filter(p => p.status === 'delivered').length },
    { id: 'paid', label: 'Paid', count: MOCK_PURCHASES.filter(p => p.status === 'paid').length },
  ];

  const getPurchases = () => {
    if (activeTab === 'all') return MOCK_PURCHASES;
    return MOCK_PURCHASES.filter(p => p.status === activeTab);
  };

  const purchases = getPurchases();

  // ─── Stats ───
  const stats = [
    { label: 'Total Orders', value: MOCK_PURCHASES.length, icon: '📦', color: 'rgba(59,130,246,0.12)', sub: 'All time' },
    { label: 'Pending Payment', value: MOCK_PURCHASES.filter(p => p.status === 'pending' || p.status === 'processing').length, icon: '⏳', color: 'rgba(234,179,8,0.12)', sub: 'Need attention' },
    { label: 'Delivered', value: MOCK_PURCHASES.filter(p => p.status === 'delivered').length, icon: '✅', color: 'rgba(34,197,94,0.12)', sub: 'Awaiting payment' },
    { label: 'Total Spent', value: 'KES 42,900', icon: '💰', color: 'rgba(232,120,32,0.12)', sub: 'This month' },
  ];

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: '⏳ Pending', class: 'pending' },
      processing: { label: '🔄 Processing', class: 'processing' },
      delivered: { label: '✅ Delivered', class: 'delivered' },
      paid: { label: '💰 Paid', class: 'paid' },
    };
    return map[status] || map.pending;
  };

  const handleViewInvoice = (purchase) => {
    const invoice = MOCK_INVOICES.find(inv => inv.poId === purchase.id);
    setSelectedInvoice(invoice || null);
    setShowInvoiceModal(true);
  };

  const handleMakePayment = (purchase) => {
    setSelectedPurchase(purchase);
    setShowPaymentModal(true);
  };

  return (
    <div className="parts-purchases">
      {/* ── Stats Row ── */}
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

      {/* ── Filter Tabs ── */}
      <div className="finance-filter-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`finance-filter-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="finance-filter-count">{tab.count}</span>
          </button>
        ))}
        <div className="finance-filter-search">
          <span>🔍</span>
          <input placeholder="Search orders..." />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="finance-table-wrap">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Part</th>
              <th>Qty</th>
              <th>Supplier</th>
              <th>Order Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="8" className="finance-empty-cell">
                  <div className="finance-empty-state">
                    <div className="finance-empty-icon">📭</div>
                    <div className="finance-empty-title">No orders</div>
                    <div className="finance-empty-sub">No purchases in this category</div>
                  </div>
                </td>
              </tr>
            ) : (
              purchases.map(p => {
                const status = getStatusBadge(p.status);
                return (
                  <tr key={p.id}>
                    <td className="finance-cell-id">{p.id}</td>
                    <td>
                      <div className="finance-cell-part">{p.part}</div>
                      <div className="finance-cell-meta">
                        🔧 {p.mechanic} · 🚗 {p.car}
                      </div>
                    </td>
                    <td>{p.quantity}</td>
                    <td>{p.supplier}</td>
                    <td>{new Date(p.orderDate).toLocaleDateString('en-KE')}</td>
                    <td className="finance-cell-amount">{p.totalAmount}</td>
                    <td>
                      <span className={`finance-status-badge ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="finance-cell-actions">
                        <button 
                          className="finance-table-btn view"
                          onClick={() => setSelectedPurchase(p)}
                        >
                          📋 View
                        </button>
                        {p.status !== 'paid' && (
                          <button 
                            className="finance-table-btn pay"
                            onClick={() => handleMakePayment(p)}
                          >
                            💰 Pay
                          </button>
                        )}
                        <button 
                          className="finance-table-btn invoice"
                          onClick={() => handleViewInvoice(p)}
                        >
                          📄 Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Detail Modal ── */}
      {selectedPurchase && (
        <div className="finance-modal-overlay" onClick={() => setSelectedPurchase(null)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">📋 Order Details</div>
            <div className="finance-modal-body">
              <div className="finance-modal-summary">
                <div><strong>Order #:</strong> {selectedPurchase.id}</div>
                <div><strong>Part:</strong> {selectedPurchase.part}</div>
                <div><strong>Quantity:</strong> {selectedPurchase.quantity}</div>
                <div><strong>Supplier:</strong> {selectedPurchase.supplier}</div>
                <div><strong>Order Date:</strong> {new Date(selectedPurchase.orderDate).toLocaleDateString('en-KE')}</div>
                <div><strong>Delivery Date:</strong> {new Date(selectedPurchase.deliveryDate).toLocaleDateString('en-KE')}</div>
                <div><strong>Total:</strong> {selectedPurchase.totalAmount}</div>
                <div><strong>Payment Method:</strong> {selectedPurchase.paymentMethod}</div>
                <div><strong>Mechanic:</strong> {selectedPurchase.mechanic}</div>
                <div><strong>Vehicle:</strong> {selectedPurchase.car}</div>
              </div>

              <div className="finance-modal-section">
                <div className="finance-modal-label">Items</div>
                <div className="finance-modal-items">
                  {selectedPurchase.items.map((item, i) => (
                    <div key={i} className="finance-modal-item">
                      <span>{item.name}</span>
                      <span>{item.quantity} × {item.unitPrice}</span>
                      <span className="finance-modal-item-total">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="finance-modal-budget">
                Status: <strong>{getStatusBadge(selectedPurchase.status).label}</strong>
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setSelectedPurchase(null)}>Close</button>
              {selectedPurchase.status !== 'paid' && (
                <button className="finance-modal-btn save" onClick={() => {
                  setShowPaymentModal(true);
                  setSelectedPurchase(null);
                }}>
                  💰 Make Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Invoice Modal ── */}
      {showInvoiceModal && (
        <div className="finance-modal-overlay" onClick={() => setShowInvoiceModal(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">📄 Invoice</div>
            <div className="finance-modal-body">
              {selectedInvoice ? (
                <>
                  <div className="finance-modal-summary">
                    <div><strong>Invoice #:</strong> {selectedInvoice.id}</div>
                    <div><strong>PO #:</strong> {selectedInvoice.poId}</div>
                    <div><strong>Supplier:</strong> {selectedInvoice.supplier}</div>
                    <div><strong>Issue Date:</strong> {new Date(selectedInvoice.issueDate).toLocaleDateString('en-KE')}</div>
                    <div><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString('en-KE')}</div>
                    <div><strong>Amount:</strong> {selectedInvoice.amount}</div>
                    <div>
                      <strong>Status:</strong>{' '}
                      <span className={`finance-status-badge ${selectedInvoice.status === 'paid' ? 'paid' : 'pending'}`}>
                        {selectedInvoice.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="finance-modal-budget">
                    Payment Terms: Net 14 days from invoice date
                  </div>
                </>
              ) : (
                <div className="finance-empty-state">
                  <div className="finance-empty-icon">📄</div>
                  <div className="finance-empty-title">No invoice found</div>
                  <div className="finance-empty-sub">This order doesn't have an invoice yet</div>
                </div>
              )}
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowInvoiceModal(false)}>Close</button>
              {selectedInvoice && selectedInvoice.status !== 'paid' && (
                <button className="finance-modal-btn save">📥 Download PDF</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Modal ── */}
      {showPaymentModal && (
        <div className="finance-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">💰 Make Payment</div>
            <div className="finance-modal-body">
              {selectedPurchase && (
                <div className="finance-modal-summary">
                  <div><strong>Order #:</strong> {selectedPurchase.id}</div>
                  <div><strong>Supplier:</strong> {selectedPurchase.supplier}</div>
                  <div><strong>Amount:</strong> {selectedPurchase.totalAmount}</div>
                </div>
              )}
              
              <div className="finance-modal-field">
                <label>Payment Method</label>
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
                <label>Reference #</label>
                <input className="finance-modal-input" placeholder="e.g. PAY-2026-001" />
              </div>

              <div className="finance-modal-field">
                <label>Notes (optional)</label>
                <textarea className="finance-modal-textarea" placeholder="Add any payment notes..." rows={2} />
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="finance-modal-btn save" onClick={() => {
                alert(`✅ Payment for ${selectedPurchase?.id} processed!`);
                setShowPaymentModal(false);
                setSelectedPurchase(null);
              }}>
                💰 Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}