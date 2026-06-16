// src/pages/Finance/components/Overheads.jsx
import { useState } from 'react';

const MOCK_BILLS = [
  { id: 1, category: 'Utilities', name: 'KPLC Electricity', amount: 9800, paid: true, dueDate: '2026-06-20', icon: '⚡' },
  { id: 2, category: 'Utilities', name: 'Generator Fuel', amount: 9600, paid: false, dueDate: '2026-06-25', icon: '⛽' },
  { id: 3, category: 'Utilities', name: 'Nairobi Water', amount: 2400, paid: true, dueDate: '2026-06-15', icon: '💧' },
  { id: 4, category: 'Premises', name: 'Rent - Main Garage', amount: 25000, paid: true, dueDate: '2026-06-05', icon: '🏢' },
  { id: 5, category: 'Premises', name: 'Rent - Overflow Yard', amount: 8500, paid: false, dueDate: '2026-06-28', icon: '🏗️' },
  { id: 6, category: 'Premises', name: 'Security Service', amount: 8000, paid: true, dueDate: '2026-06-30', icon: '🛡️' },
  { id: 7, category: 'Equipment', name: 'Compressor Maintenance', amount: 4500, paid: false, dueDate: '2026-07-10', icon: '🔧' },
  { id: 8, category: 'Consumables', name: 'Rags, Welding Rods, Cleaner', amount: 3200, paid: true, dueDate: '2026-06-12', icon: '🧹' },
  { id: 9, category: 'Consumables', name: 'Uniforms & PPE', amount: 6800, paid: false, dueDate: '2026-07-05', icon: '👕' },
  { id: 10, category: 'Staff Welfare', name: 'Tea/Lunch Allowance', amount: 7700, paid: true, dueDate: '2026-06-30', icon: '☕' },
  { id: 11, category: 'Staff Welfare', name: 'First Aid & Medical', amount: 2400, paid: false, dueDate: '2026-07-01', icon: '🩺' },
  { id: 12, category: 'Permits', name: 'Nairobi County Permit', amount: 3000, paid: true, dueDate: '2026-06-01', icon: '📜' },
  { id: 13, category: 'Permits', name: 'NEMA Environmental Levy', amount: 2500, paid: false, dueDate: '2026-07-15', icon: '🌿' },
  { id: 14, category: 'Permits', name: 'Fire Safety Certificate', amount: 2000, paid: true, dueDate: '2026-05-20', icon: '🔥' },
];

const CATEGORY_TOTALS = {
  Utilities: 21800,
  Premises: 41500,
  Equipment: 4500,
  Consumables: 10000,
  'Staff Welfare': 10100,
  Permits: 7500,
};

const TOTAL_OVERHEADS = 95400;

export default function Overheads() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddBill, setShowAddBill] = useState(false);
  const [newBill, setNewBill] = useState({ category: '', name: '', amount: '', dueDate: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Utilities', 'Premises', 'Equipment', 'Consumables', 'Staff Welfare', 'Permits'];

  const getFilteredBills = () => {
    let filtered = MOCK_BILLS;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  };

  const bills = getFilteredBills();

  const stats = [
    { label: 'Total Overheads', value: `KES ${TOTAL_OVERHEADS.toLocaleString()}`, icon: '📊', color: 'rgba(232,120,32,0.12)', sub: 'This month' },
    { label: 'Paid', value: MOCK_BILLS.filter(b => b.paid).length, icon: '✅', color: 'rgba(34,197,94,0.12)', sub: 'Bills settled' },
    { label: 'Pending', value: MOCK_BILLS.filter(b => !b.paid).length, icon: '⏳', color: 'rgba(234,179,8,0.12)', sub: 'Need payment' },
    { label: 'Categories', value: Object.keys(CATEGORY_TOTALS).length, icon: '📁', color: 'rgba(59,130,246,0.12)', sub: 'Active categories' },
  ];

  const handleAddBill = () => {
    if (!newBill.category || !newBill.name || !newBill.amount) {
      alert('Please fill in all required fields');
      return;
    }
    alert(`✅ Bill "${newBill.name}" added successfully!`);
    setShowAddBill(false);
    setNewBill({ category: '', name: '', amount: '', dueDate: '' });
  };

  return (
    <div className="overheads-screen">
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

      {/* ── Category Breakdown ── */}
      <div className="overheads-categories">
        {Object.entries(CATEGORY_TOTALS).map(([category, total]) => {
          const percentage = (total / TOTAL_OVERHEADS) * 100;
          return (
            <div key={category} className="overheads-category">
              <div className="overheads-category-header">
                <span className="overheads-category-name">{category}</span>
                <span className="overheads-category-amount">KES {total.toLocaleString()}</span>
              </div>
              <div className="overheads-category-bar">
                <div className="overheads-category-fill" style={{ width: `${percentage}%` }} />
              </div>
              <div className="overheads-category-percent">{percentage.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="finance-filter-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`finance-filter-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            <span className="finance-filter-count">
              {cat === 'all' ? MOCK_BILLS.length : MOCK_BILLS.filter(b => b.category === cat).length}
            </span>
          </button>
        ))}
        <div className="finance-filter-search">
          <span>🔍</span>
          <input 
            placeholder="Search bills..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="finance-btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowAddBill(true)}>
          ➕ Add Bill
        </button>
      </div>

      {/* ── Bills Table ── */}
      <div className="finance-table-wrap">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Bill</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="6" className="finance-empty-cell">
                  <div className="finance-empty-state">
                    <div className="finance-empty-icon">📭</div>
                    <div className="finance-empty-title">No bills</div>
                    <div className="finance-empty-sub">No bills in this category</div>
                  </div>
                </td>
              </tr>
            ) : (
              bills.map(b => (
                <tr key={b.id}>
                  <td>
                    <div className="finance-cell-bill">
                      <span className="finance-bill-icon">{b.icon}</span>
                      <span>{b.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="finance-category-tag">{b.category}</span>
                  </td>
                  <td className="finance-cell-amount">KES {b.amount.toLocaleString()}</td>
                  <td>{new Date(b.dueDate).toLocaleDateString('en-KE')}</td>
                  <td>
                    <span className={`finance-status-badge ${b.paid ? 'paid' : 'pending'}`}>
                      {b.paid ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="finance-cell-actions">
                      {!b.paid && (
                        <button className="finance-table-btn pay">
                          💰 Pay
                        </button>
                      )}
                      <button className="finance-table-btn view">
                        📋 Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Bill Modal ── */}
      {showAddBill && (
        <div className="finance-modal-overlay" onClick={() => setShowAddBill(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">➕ Add New Bill</div>
            <div className="finance-modal-body">
              <div className="finance-modal-field">
                <label>Category *</label>
                <select 
                  className="finance-modal-select"
                  value={newBill.category}
                  onChange={e => setNewBill({ ...newBill, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="finance-modal-field">
                <label>Bill Name *</label>
                <input 
                  className="finance-modal-input" 
                  placeholder="e.g. KPLC Electricity"
                  value={newBill.name}
                  onChange={e => setNewBill({ ...newBill, name: e.target.value })}
                />
              </div>

              <div className="finance-modal-field">
                <label>Amount (KES) *</label>
                <input 
                  type="number" 
                  className="finance-modal-input" 
                  placeholder="e.g. 9800"
                  value={newBill.amount}
                  onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
                />
              </div>

              <div className="finance-modal-field">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="finance-modal-input"
                  value={newBill.dueDate}
                  onChange={e => setNewBill({ ...newBill, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowAddBill(false)}>Cancel</button>
              <button className="finance-modal-btn save" onClick={handleAddBill}>➕ Add Bill</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}