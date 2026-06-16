import { useState } from 'react';

const MOCK_REQUESTS = [
  {
    id: 1,
    part: 'Brake pads (Toyota Fielder)',
    car: 'KBZ 123A',
    jobRef: 'JOB-2026-042',
    mechanic: 'John Kamau',
    time: '2 hours ago',
    urgent: true,
    stockCheck: 'Out of stock',
    supplier: 'AutoParts Kenya',
    deliveryEstimate: '2-3 days',
    total: 'KES 9,600',
    status: 'pending',
    history: [
      { step: 'Mechanic requested part', by: 'John Kamau', time: '2 hours ago' },
      { step: 'Stock check: Out of stock', by: 'Store Keeper', time: '1.5 hours ago' },
      { step: 'Supplier found', by: 'Admin', time: '1 hour ago' },
      { step: 'Sent to Finance for approval', by: 'Admin', time: '45 min ago' },
    ],
    supplierDetails: {
      name: 'AutoParts Kenya',
      rating: 4.8,
      phone: '+254 700 123 456',
      email: 'info@autoparts.co.ke',
    },
  },
  {
    id: 2,
    part: 'Oil filter (5L)',
    car: 'KDA 456B',
    jobRef: 'JOB-2026-041',
    mechanic: 'Sarah Wanjiru',
    time: '4 hours ago',
    urgent: false,
    stockCheck: 'Out of stock',
    supplier: 'Mombasa Spares',
    deliveryEstimate: '1-2 days',
    total: 'KES 5,100',
    status: 'pending',
    history: [
      { step: 'Mechanic requested part', by: 'Sarah Wanjiru', time: '4 hours ago' },
      { step: 'Stock check: Out of stock', by: 'Store Keeper', time: '3.5 hours ago' },
      { step: 'Supplier found', by: 'Admin', time: '3 hours ago' },
      { step: 'Sent to Finance for approval', by: 'Admin', time: '2.5 hours ago' },
    ],
    supplierDetails: {
      name: 'Mombasa Spares',
      rating: 4.5,
      phone: '+254 722 987 654',
      email: 'sales@mombasaspares.co.ke',
    },
  },
  {
    id: 3,
    part: 'Alternator belt',
    car: 'KBZ 789C',
    jobRef: 'JOB-2026-039',
    mechanic: 'Peter Ochieng',
    time: '1 day ago',
    urgent: false,
    stockCheck: 'Out of stock',
    supplier: 'Nakuru Auto',
    deliveryEstimate: '3-4 days',
    total: 'KES 8,200',
    status: 'pending',
    history: [
      { step: 'Mechanic requested part', by: 'Peter Ochieng', time: '1 day ago' },
      { step: 'Stock check: Out of stock', by: 'Store Keeper', time: '23 hours ago' },
      { step: 'Supplier found', by: 'Admin', time: '22 hours ago' },
      { step: 'Sent to Finance for approval', by: 'Admin', time: '21 hours ago' },
    ],
    supplierDetails: {
      name: 'Nakuru Auto',
      rating: 4.2,
      phone: '+254 733 456 789',
      email: 'info@nakuruauto.co.ke',
    },
  },
];

const APPROVED_REQUESTS = [
  {
    id: 4,
    part: 'Spark plugs (NGK) ×4',
    car: 'KDA 456B',
    jobRef: 'JOB-2026-038',
    mechanic: 'Sarah Wanjiru',
    time: '2 days ago',
    urgent: false,
    stockCheck: 'Out of stock',
    supplier: 'AutoParts Kenya',
    deliveryEstimate: 'Delivered',
    total: 'KES 3,200',
    status: 'approved',
  },
  {
    id: 5,
    part: 'Engine oil 5L ×6',
    car: 'KBZ 123A',
    jobRef: 'JOB-2026-037',
    mechanic: 'John Kamau',
    time: '3 days ago',
    urgent: false,
    stockCheck: 'Out of stock',
    supplier: 'Mombasa Spares',
    deliveryEstimate: 'Delivered',
    total: 'KES 16,800',
    status: 'approved',
  },
];

const REJECTED_REQUESTS = [
  {
    id: 6,
    part: 'Turbocharger',
    car: 'KDA 123X',
    jobRef: 'JOB-2026-035',
    mechanic: 'Peter Ochieng',
    time: '5 days ago',
    urgent: true,
    stockCheck: 'Out of stock',
    supplier: 'AutoParts Kenya',
    deliveryEstimate: 'N/A',
    total: 'KES 45,000',
    status: 'rejected',
    rejectionReason: 'Budget exceeded for this month',
  },
];

export default function ApprovalsQueue() {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [note, setNote] = useState('');

  const getRequests = () => {
    if (selectedTab === 'pending') return MOCK_REQUESTS;
    if (selectedTab === 'approved') return APPROVED_REQUESTS;
    if (selectedTab === 'rejected') return REJECTED_REQUESTS;
    return [...MOCK_REQUESTS, ...APPROVED_REQUESTS, ...REJECTED_REQUESTS];
  };

  const requests = getRequests();

  // ─── Stats ───
  const stats = [
    { label: 'Pending', value: MOCK_REQUESTS.length, icon: '⏳', color: 'rgba(234,179,8,0.12)', sub: 'Needs your action' },
    { label: 'Approved', value: APPROVED_REQUESTS.length, icon: '✅', color: 'rgba(34,197,94,0.12)', sub: 'KES 87,400 this month' },
    { label: 'Rejected', value: REJECTED_REQUESTS.length, icon: '❌', color: 'rgba(239,68,68,0.12)', sub: 'KES 12,800 saved' },
    { label: 'Avg. Time', value: '4.2h', icon: '⏱️', color: 'rgba(59,130,246,0.12)', sub: '-12% vs last month' },
  ];

  // ─── Handlers ───
  const handleApprove = () => setShowApproveModal(true);
  const confirmApprove = () => {
    alert(`✅ Request #${selectedRequest?.id} approved! Supplier will be notified.`);
    setShowApproveModal(false);
    setSelectedRequest(null);
  };

  const handleReject = () => setShowRejectModal(true);
  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    alert(`❌ Request #${selectedRequest?.id} rejected. Reason: ${rejectReason}`);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedRequest(null);
  };

  const handleHold = () => {
    alert(`⏸️ Request #${selectedRequest?.id} put on hold.`);
    setSelectedRequest(null);
  };

  const tabs = [
    { id: 'all', label: 'All', count: MOCK_REQUESTS.length + APPROVED_REQUESTS.length + REJECTED_REQUESTS.length },
    { id: 'pending', label: 'Pending', count: MOCK_REQUESTS.length },
    { id: 'approved', label: 'Approved', count: APPROVED_REQUESTS.length },
    { id: 'on hold', label: 'On Hold', count: 0 },
    { id: 'rejected', label: 'Rejected', count: REJECTED_REQUESTS.length },
  ];

  return (
    <div className="approvals-queue">
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
            className={`finance-filter-tab ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
            <span className="finance-filter-count">{tab.count}</span>
          </button>
        ))}
        <div className="finance-filter-search">
          <span>🔍</span>
          <input placeholder="Search requests..." />
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="finance-approvals-layout">
        {/* Left: Request Cards */}
        <div className="finance-request-list">
          {requests.length === 0 ? (
            <div className="finance-empty-state">
              <div className="finance-empty-icon">📭</div>
              <div className="finance-empty-title">No requests</div>
              <div className="finance-empty-sub">Nothing in this category</div>
            </div>
          ) : (
            requests.map(req => {
              const isSelected = selectedRequest?.id === req.id;
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.id}
                  className={`finance-request-card ${isSelected ? 'selected' : ''} ${req.urgent ? 'urgent' : ''} ${isApproved ? 'approved' : ''} ${isRejected ? 'rejected' : ''}`}
                  onClick={() => setSelectedRequest(req)}
                >
                  <div className="finance-request-card-header">
                    <div className="finance-request-part">{req.part}</div>
                    <div className="finance-request-status">
                      {isPending && <span className="status-badge pending">⏳ Pending</span>}
                      {isApproved && <span className="status-badge approved">✅ Approved</span>}
                      {isRejected && <span className="status-badge rejected">❌ Rejected</span>}
                    </div>
                  </div>

                  <div className="finance-request-card-body">
                    <div className="finance-request-meta">
                      <span>🚗 {req.car}</span>
                      <span>📋 {req.jobRef}</span>
                      <span>🔧 {req.mechanic}</span>
                      <span>⏱️ {req.time}</span>
                    </div>
                    <div className="finance-request-supplier">
                      <span>🏪 {req.supplier}</span>
                      <span className="finance-delivery">{req.deliveryEstimate}</span>
                    </div>
                    {req.stockCheck && (
                      <div className="finance-stock-check">
                        <span>📦 Stock: {req.stockCheck}</span>
                      </div>
                    )}
                    {req.rejectionReason && (
                      <div className="finance-rejection-reason">
                        <span>⚠️ {req.rejectionReason}</span>
                      </div>
                    )}
                  </div>

                  <div className="finance-request-card-footer">
                    <div className="finance-request-total">{req.total}</div>
                    {req.urgent && <span className="finance-urgent-badge">🚨 Urgent</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detail Panel */}
        <div className="finance-detail-panel">
          {selectedRequest ? (
            <>
              <div className="finance-detail-header">
                <div className="finance-detail-title">Request #{selectedRequest.id}</div>
                <div className="finance-detail-status">
                  {selectedRequest.status === 'pending' && <span className="status-badge pending">⏳ Pending</span>}
                  {selectedRequest.status === 'approved' && <span className="status-badge approved">✅ Approved</span>}
                  {selectedRequest.status === 'rejected' && <span className="status-badge rejected">❌ Rejected</span>}
                </div>
              </div>

              <div className="finance-detail-body">
                {/* Part details */}
                <div className="finance-detail-section">
                  <div className="finance-detail-label">Part</div>
                  <div className="finance-detail-value">{selectedRequest.part}</div>
                </div>

                <div className="finance-detail-row">
                  <div className="finance-detail-section">
                    <div className="finance-detail-label">Vehicle</div>
                    <div className="finance-detail-value">{selectedRequest.car}</div>
                  </div>
                  <div className="finance-detail-section">
                    <div className="finance-detail-label">Job Reference</div>
                    <div className="finance-detail-value">{selectedRequest.jobRef}</div>
                  </div>
                </div>

                <div className="finance-detail-section">
                  <div className="finance-detail-label">Mechanic</div>
                  <div className="finance-detail-value">{selectedRequest.mechanic}</div>
                </div>

                {/* Supplier info */}
                {selectedRequest.supplierDetails && (
                  <div className="finance-detail-section">
                    <div className="finance-detail-label">Supplier</div>
                    <div className="finance-detail-supplier">
                      <div className="finance-detail-value">{selectedRequest.supplierDetails.name}</div>
                      <div className="finance-supplier-rating">
                        <span>⭐</span> {selectedRequest.supplierDetails.rating}
                      </div>
                      <div className="finance-supplier-contact">
                        <span>📞 {selectedRequest.supplierDetails.phone}</span>
                        <span>✉️ {selectedRequest.supplierDetails.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cost */}
                <div className="finance-detail-section highlight">
                  <div className="finance-detail-label">Total Amount</div>
                  <div className="finance-detail-amount">{selectedRequest.total}</div>
                  <div className="finance-detail-sub">Delivery: {selectedRequest.deliveryEstimate}</div>
                </div>

                {/* Notes */}
                <div className="finance-detail-section">
                  <div className="finance-detail-label">Finance Notes</div>
                  <textarea
                    className="finance-detail-textarea"
                    placeholder="Add a note before approving or rejecting..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                {selectedRequest.status === 'pending' && (
                  <div className="finance-detail-actions">
                    <button className="finance-action-btn approve" onClick={handleApprove}>
                      ✅ Approve & Send to Supplier
                    </button>
                    <button className="finance-action-btn hold" onClick={handleHold}>
                      ⏸️ Put on Hold
                    </button>
                    <button className="finance-action-btn reject" onClick={handleReject}>
                      ❌ Reject
                    </button>
                  </div>
                )}

                {/* Audit Trail */}
                <div className="finance-detail-section">
                  <div className="finance-detail-label">📋 Audit Trail</div>
                  <div className="finance-audit-trail">
                    {selectedRequest.history?.map((h, i) => (
                      <div key={i} className="finance-audit-item">
                        <div className="finance-audit-dot" />
                        <div>
                          <div className="finance-audit-step">{h.step}</div>
                          <div className="finance-audit-meta">by {h.by} · {h.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="finance-detail-empty">
              <div className="finance-detail-empty-icon">👆</div>
              <div className="finance-detail-empty-title">Select a request</div>
              <div className="finance-detail-empty-sub">Click a request card to view full details</div>
            </div>
          )}
        </div>
      </div>

      {/* ── APPROVE MODAL ── */}
      {showApproveModal && selectedRequest && (
        <div className="finance-modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">✅ Confirm Approval</div>
            <div className="finance-modal-body">
              <p>You are about to approve:</p>
              <div className="finance-modal-summary">
                <div><strong>Part:</strong> {selectedRequest.part}</div>
                <div><strong>Supplier:</strong> {selectedRequest.supplier}</div>
                <div><strong>Total:</strong> {selectedRequest.total}</div>
              </div>
              <div className="finance-modal-budget">
                Budget remaining: <strong>KES 142,000</strong> / 200,000
              </div>
              <div className="finance-modal-field">
                <label>Payment Method</label>
                <select className="finance-modal-select">
                  <option>M-Pesa</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                </select>
              </div>
              <div className="finance-modal-field">
                <label>Reference #</label>
                <input className="finance-modal-input" placeholder="e.g. PO-2026-1042" defaultValue={`PO-2026-${String(selectedRequest.id).padStart(4, '0')}`} />
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowApproveModal(false)}>Cancel</button>
              <button className="finance-modal-btn save" onClick={confirmApprove}>✅ Approve & Send</button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {showRejectModal && selectedRequest && (
        <div className="finance-modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">❌ Reject Request</div>
            <div className="finance-modal-body">
              <p>You are about to reject:</p>
              <div className="finance-modal-summary">
                <div><strong>Part:</strong> {selectedRequest.part}</div>
                <div><strong>Total:</strong> {selectedRequest.total}</div>
              </div>
              <div className="finance-modal-field">
                <label>Reason for rejection *</label>
                <textarea
                  className="finance-modal-textarea"
                  placeholder="e.g. Budget exceeded, part available elsewhere, etc."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="finance-modal-btn danger" onClick={confirmReject}>❌ Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}