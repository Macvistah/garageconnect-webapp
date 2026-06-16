// src/pages/Finance/components/Payroll.jsx
import { useState } from 'react';

const MOCK_EMPLOYEES = [
  {
    id: 1,
    name: 'John Kamau',
    role: 'Senior Mechanic',
    payCycle: 'Monthly',
    hourlyRate: 450,
    hoursWorked: 168,
    grossPay: 75600,
    deductions: {
      kra: 3200,
      nssf: 1200,
      sha: 800,
      housingLevy: 1134,
      helb: 0,
      electricity: 350,
      water: 100,
      teaAllowance: 2000,
    },
    netPay: 66950,
    status: 'pending',
    bankDetails: {
      bank: 'KCB',
      account: '1234567890',
      branch: 'Ruiru',
    },
  },
  {
    id: 2,
    name: 'Sarah Wanjiru',
    role: 'Electrical Specialist',
    payCycle: 'Weekly',
    hourlyRate: 480,
    hoursWorked: 142,
    grossPay: 68160,
    deductions: {
      kra: 2800,
      nssf: 1200,
      sha: 600,
      housingLevy: 1022,
      helb: 1500,
      electricity: 280,
      water: 80,
      teaAllowance: 500,
    },
    netPay: 55960,
    status: 'pending',
    bankDetails: {
      bank: 'Equity',
      account: '0987654321',
      branch: 'Thika Road',
    },
  },
  {
    id: 3,
    name: 'Peter Ochieng',
    role: 'Brake Specialist',
    payCycle: 'Monthly',
    hourlyRate: 420,
    hoursWorked: 156,
    grossPay: 65520,
    deductions: {
      kra: 3000,
      nssf: 1200,
      sha: 800,
      housingLevy: 983,
      helb: 0,
      electricity: 300,
      water: 90,
      teaAllowance: 2000,
    },
    netPay: 57147,
    status: 'paid',
    bankDetails: {
      bank: 'Co-operative',
      account: '5678901234',
      branch: 'Kasarani',
    },
  },
  {
    id: 4,
    name: 'Mary Akinyi',
    role: 'Receptionist',
    payCycle: 'Monthly',
    hourlyRate: 300,
    hoursWorked: 160,
    grossPay: 48000,
    deductions: {
      kra: 1800,
      nssf: 1200,
      sha: 400,
      housingLevy: 720,
      helb: 0,
      electricity: 200,
      water: 60,
      teaAllowance: 2000,
    },
    netPay: 41820,
    status: 'paid',
    bankDetails: {
      bank: 'KCB',
      account: '4321098765',
      branch: 'CBD',
    },
  },
  {
    id: 5,
    name: 'David Mwangi',
    role: 'Diagnostic Technician',
    payCycle: 'Daily',
    hourlyRate: 500,
    hoursWorked: 120,
    grossPay: 60000,
    deductions: {
      kra: 2500,
      nssf: 1200,
      sha: 700,
      housingLevy: 900,
      helb: 2000,
      electricity: 250,
      water: 70,
      teaAllowance: 1200,
    },
    netPay: 50880,
    status: 'pending',
    bankDetails: {
      bank: 'Standard Chartered',
      account: '6789012345',
      branch: 'Westlands',
    },
  },
];

const DEDUCTION_TOTALS = {
  kra: 13300,
  nssf: 6000,
  sha: 3300,
  housingLevy: 4759,
  helb: 3500,
  electricity: 1380,
  water: 400,
  teaAllowance: 7700,
};

export default function Payroll() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPaySlip, setShowPaySlip] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedForProcessing, setSelectedForProcessing] = useState(null);
  const [payPeriod, setPayPeriod] = useState('monthly');

  const tabs = [
    { id: 'all', label: 'All Staff', count: MOCK_EMPLOYEES.length },
    { id: 'pending', label: 'Pending', count: MOCK_EMPLOYEES.filter(e => e.status === 'pending').length },
    { id: 'paid', label: 'Paid', count: MOCK_EMPLOYEES.filter(e => e.status === 'paid').length },
  ];

  const getEmployees = () => {
    if (selectedTab === 'all') return MOCK_EMPLOYEES;
    return MOCK_EMPLOYEES.filter(e => e.status === selectedTab);
  };

  const employees = getEmployees();

  const stats = [
    { label: 'Total Staff', value: MOCK_EMPLOYEES.length, icon: '👨‍🔧', color: 'rgba(59,130,246,0.12)', sub: 'Active employees' },
    { label: 'Pending Payroll', value: MOCK_EMPLOYEES.filter(e => e.status === 'pending').length, icon: '⏳', color: 'rgba(234,179,8,0.12)', sub: 'Need processing' },
    { label: 'Total Gross', value: 'KES 317,280', icon: '💰', color: 'rgba(232,120,32,0.12)', sub: 'This period' },
    { label: 'Total Net', value: 'KES 273,107', icon: '🏦', color: 'rgba(34,197,94,0.12)', sub: 'After deductions' },
  ];

  const getStatusBadge = (status) => {
    return status === 'paid' 
      ? <span className="finance-status-badge paid">✅ Paid</span>
      : <span className="finance-status-badge pending">⏳ Pending</span>;
  };

  const getPayCycleBadge = (cycle) => {
    const colors = {
      Daily: 'rgba(59,130,246,0.12)',
      Weekly: 'rgba(234,179,8,0.12)',
      Monthly: 'rgba(232,120,32,0.12)',
    };
    return (
      <span className="finance-paycycle-badge" style={{ background: colors[cycle] }}>
        {cycle}
      </span>
    );
  };

  const handleProcessPayroll = () => {
    setShowProcessModal(true);
  };

  const confirmProcessPayroll = () => {
    alert('✅ Payroll processed successfully! All pending payments have been initiated.');
    setShowProcessModal(false);
  };

  return (
    <div className="payroll-screen">
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
          <input placeholder="Search staff..." />
        </div>
        <button className="finance-btn-primary" style={{ marginLeft: 'auto' }} onClick={handleProcessPayroll}>
          💰 Process Payroll
        </button>
      </div>

      {/* ── Table ── */}
      <div className="finance-table-wrap">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Pay Cycle</th>
              <th>Hours</th>
              <th>Gross Pay</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="9" className="finance-empty-cell">
                  <div className="finance-empty-state">
                    <div className="finance-empty-icon">📭</div>
                    <div className="finance-empty-title">No employees</div>
                    <div className="finance-empty-sub">No staff in this category</div>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map(e => {
                const totalDeductions = Object.values(e.deductions).reduce((a, b) => a + b, 0);
                return (
                  <tr key={e.id}>
                    <td>
                      <div className="finance-cell-employee">
                        <div className="finance-cell-avatar">{e.name.charAt(0)}</div>
                        <div>
                          <div className="finance-cell-name">{e.name}</div>
                          <div className="finance-cell-bank">{e.bankDetails.bank}</div>
                        </div>
                      </div>
                    </td>
                    <td>{e.role}</td>
                    <td>{getPayCycleBadge(e.payCycle)}</td>
                    <td>{e.hoursWorked}h</td>
                    <td className="finance-cell-amount">KES {e.grossPay.toLocaleString()}</td>
                    <td className="finance-cell-deductions">
                      <div>KES {totalDeductions.toLocaleString()}</div>
                      <div className="finance-deduction-breakdown">
                        <span>KRA: {e.deductions.kra}</span>
                        <span>NSSF: {e.deductions.nssf}</span>
                        <span>SHA: {e.deductions.sha}</span>
                      </div>
                    </td>
                    <td className="finance-cell-amount" style={{ color: '#22c55e' }}>
                      KES {e.netPay.toLocaleString()}
                    </td>
                    <td>{getStatusBadge(e.status)}</td>
                    <td>
                      <div className="finance-cell-actions">
                        <button 
                          className="finance-table-btn view"
                          onClick={() => { setSelectedEmployee(e); setShowPaySlip(true); }}
                        >
                          📄 Payslip
                        </button>
                        {e.status === 'pending' && (
                          <button 
                            className="finance-table-btn pay"
                            onClick={() => {
                              setSelectedForProcessing(e);
                              setShowProcessModal(true);
                            }}
                          >
                            💰 Pay
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

      {/* ── Pay Slip Modal ── */}
      {showPaySlip && selectedEmployee && (
        <div className="finance-modal-overlay" onClick={() => setShowPaySlip(false)}>
          <div className="finance-modal payslip-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">📄 Pay Slip</div>
            <div className="finance-modal-body">
              <div className="payslip-header">
                <div className="payslip-company">Ruiru Auto Centre</div>
                <div className="payslip-period">Pay Period: June 2026</div>
              </div>

              <div className="payslip-employee">
                <div><strong>{selectedEmployee.name}</strong></div>
                <div>{selectedEmployee.role}</div>
                <div>Pay Cycle: {selectedEmployee.payCycle}</div>
              </div>

              <div className="payslip-grid">
                <div className="payslip-section">
                  <div className="payslip-section-title">Earnings</div>
                  <div className="payslip-row">
                    <span>Hours Worked</span>
                    <span>{selectedEmployee.hoursWorked}h</span>
                  </div>
                  <div className="payslip-row">
                    <span>Hourly Rate</span>
                    <span>KES {selectedEmployee.hourlyRate}</span>
                  </div>
                  <div className="payslip-row total">
                    <span>Gross Pay</span>
                    <span>KES {selectedEmployee.grossPay.toLocaleString()}</span>
                  </div>
                </div>

                <div className="payslip-section">
                  <div className="payslip-section-title">Deductions</div>
                  {Object.entries(selectedEmployee.deductions).map(([key, value]) => {
                    const labels = {
                      kra: 'KRA PAYE',
                      nssf: 'NSSF',
                      sha: 'SHA (2.75%)',
                      housingLevy: 'Housing Levy',
                      helb: 'HELB',
                      electricity: 'Electricity',
                      water: 'Water',
                      teaAllowance: 'Tea Allowance',
                    };
                    if (value === 0) return null;
                    return (
                      <div key={key} className="payslip-row">
                        <span>{labels[key] || key}</span>
                        <span>-KES {value.toLocaleString()}</span>
                      </div>
                    );
                  })}
                  <div className="payslip-row total">
                    <span>Total Deductions</span>
                    <span>-KES {Object.values(selectedEmployee.deductions).reduce((a, b) => a + b, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="payslip-net">
                <div className="payslip-net-label">Net Pay</div>
                <div className="payslip-net-amount">KES {selectedEmployee.netPay.toLocaleString()}</div>
              </div>

              <div className="payslip-footer">
                <div>Payment Method: Bank Transfer</div>
                <div>{selectedEmployee.bankDetails.bank} · {selectedEmployee.bankDetails.account}</div>
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowPaySlip(false)}>Close</button>
              <button className="finance-modal-btn save">📥 Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Process Payroll Modal ── */}
      {showProcessModal && (
        <div className="finance-modal-overlay" onClick={() => setShowProcessModal(false)}>
          <div className="finance-modal" onClick={e => e.stopPropagation()}>
            <div className="finance-modal-header">💰 Process Payroll</div>
            <div className="finance-modal-body">
              <p>You are about to process payroll for:</p>
              <div className="finance-modal-summary">
                {selectedForProcessing ? (
                  <>
                    <div><strong>Employee:</strong> {selectedForProcessing.name}</div>
                    <div><strong>Net Pay:</strong> KES {selectedForProcessing.netPay.toLocaleString()}</div>
                    <div><strong>Payment Method:</strong> Bank Transfer</div>
                  </>
                ) : (
                  <>
                    <div><strong>Total Employees:</strong> {MOCK_EMPLOYEES.filter(e => e.status === 'pending').length}</div>
                    <div><strong>Total Amount:</strong> KES 181,000</div>
                    <div><strong>Pay Period:</strong> June 2026</div>
                  </>
                )}
              </div>

              <div className="finance-modal-field">
                <label>Payment Date</label>
                <input type="date" className="finance-modal-input" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="finance-modal-field">
                <label>Reference</label>
                <input className="finance-modal-input" placeholder="e.g. PAYROLL-JUN-2026" />
              </div>

              <div className="finance-modal-budget">
                ⚠️ This will initiate {selectedForProcessing ? '1 payment' : `${MOCK_EMPLOYEES.filter(e => e.status === 'pending').length} payments`}
              </div>
            </div>
            <div className="finance-modal-footer">
              <button className="finance-modal-btn cancel" onClick={() => setShowProcessModal(false)}>Cancel</button>
              <button className="finance-modal-btn save" onClick={confirmProcessPayroll}>
                💰 Process & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}