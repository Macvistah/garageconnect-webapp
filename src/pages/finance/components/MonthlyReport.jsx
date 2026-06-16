// src/pages/Finance/components/MonthlyReport.jsx
import { useState } from 'react';

export default function MonthlyReport() {
  const [month, setMonth] = useState('2026-06');

  // Mock report data
  const report = {
    income: {
      services: 46200,
      partsSales: 20800,
      other: 7400,
      total: 74400,
    },
    expenses: {
      parts: 42900,
      payroll: 181000,
      overheads: 52300,
      other: 4800,
      total: 281000,
    },
    net: -206600,
    profitMargin: -277.7,
    period: 'June 2026',
  };

  const stats = [
    { label: 'Total Income', value: `KES ${report.income.total.toLocaleString()}`, icon: '📈', color: 'rgba(34,197,94,0.12)', sub: 'Revenue' },
    { label: 'Total Expenses', value: `KES ${report.expenses.total.toLocaleString()}`, icon: '📉', color: 'rgba(239,68,68,0.12)', sub: 'Costs' },
    { label: 'Net Profit/Loss', value: `KES ${report.net.toLocaleString()}`, icon: '💰', color: 'rgba(232,120,32,0.12)', sub: report.net < 0 ? 'Loss' : 'Profit' },
    { label: 'Profit Margin', value: `${report.profitMargin}%`, icon: '📊', color: 'rgba(59,130,246,0.12)', sub: 'Net / Income' },
  ];

  const handleExportPDF = () => {
    alert('📄 PDF report generated and downloaded!');
  };

  const handleExportCSV = () => {
    alert('📊 CSV report generated and downloaded!');
  };

  const handleEmailReport = () => {
    alert('📧 Report sent to manager@garageconnect.co.ke');
  };

  return (
    <div className="report-screen">
      {/* ── Header ── */}
      <div className="report-header">
        <div className="report-header-left">
          <div className="report-title">📊 Monthly Financial Report</div>
          <div className="report-sub">{report.period}</div>
        </div>
        <div className="report-header-actions">
          <div className="report-period-selector">
            <label>Period:</label>
            <input 
              type="month" 
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="report-month-input"
            />
          </div>
          <button className="finance-btn-ghost" onClick={handleExportCSV}>📥 CSV</button>
          <button className="finance-btn-ghost" onClick={handleExportPDF}>📥 PDF</button>
          <button className="finance-btn-primary" onClick={handleEmailReport}>📧 Email</button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="finance-stats">
        {stats.map(s => (
          <div key={s.label} className="finance-stat">
            <div className="finance-stat-top">
              <span className="finance-stat-label">{s.label}</span>
              <div className="finance-stat-icon" style={{ background: s.color }}>{s.icon}</div>
            </div>
            <div className="finance-stat-value" style={{ 
              color: s.label.includes('Profit') && report.net < 0 ? '#ef4444' : 
                     s.label.includes('Expenses') ? '#ef4444' : 
                     s.label.includes('Income') ? '#22c55e' : '#fff'
            }}>
              {s.value}
            </div>
            <div className="finance-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Income vs Expenses ── */}
      <div className="report-grid">
        <div className="report-card">
          <div className="report-card-title">💰 Income Breakdown</div>
          <div className="report-breakdown">
            <div className="report-breakdown-item">
              <span>Services</span>
              <span>KES {report.income.services.toLocaleString()}</span>
              <div className="report-breakdown-bar">
                <div className="report-breakdown-fill" style={{ width: `${(report.income.services / report.income.total) * 100}%`, background: '#22c55e' }} />
              </div>
            </div>
            <div className="report-breakdown-item">
              <span>Parts Sales</span>
              <span>KES {report.income.partsSales.toLocaleString()}</span>
              <div className="report-breakdown-bar">
                <div className="report-breakdown-fill" style={{ width: `${(report.income.partsSales / report.income.total) * 100}%`, background: '#3b82f6' }} />
              </div>
            </div>
            <div className="report-breakdown-item">
              <span>Other</span>
              <span>KES {report.income.other.toLocaleString()}</span>
              <div className="report-breakdown-bar">
                <div className="report-breakdown-fill" style={{ width: `${(report.income.other / report.income.total) * 100}%`, background: '#8b5cf6' }} />
              </div>
            </div>
          </div>
          <div className="report-card-total">
            <span>Total Income</span>
            <span>KES {report.income.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-title">📉 Expense Breakdown</div>
          <div className="report-breakdown">
            <div className="report-breakdown-item">
              <span>Parts Purchases</span>
              <span>KES {report.expenses.parts.toLocaleString()}</span>
              <div className="report-breakdown-bar">
                <div className="report-breakdown-fill" style={{ width: `${(report.expenses.parts / report.expenses.total) * 100}%`, background: '#E87820' }} />
              </div>
            </div>
            <div className="report-breakdown-item">
              <span>Payroll</span>
              <span>KES {report.expenses.payroll.toLocaleString()}</span>
              <div className="report-breakdown-bar">
                <div className="report-breakdown-fill" style={{ width: `${(report.expenses.payroll / report.expenses.total) * 100}%`, background: '#ef4444' }} />
              </div>
            </div>
            <div className="report-breakdown-item">
              <span>Overheads</span>
              <span>KES {report.expenses.overheads.toLocaleString()}</span>
              <div className="report-breakdown-bar">
                <div className="report-breakdown-fill" style={{ width: `${(report.expenses.overheads / report.expenses.total) * 100}%`, background: '#eab308' }} />
              </div>
            </div>
            <div className="report-breakdown-item">
              <span>Other</span>
              <span>KES {report.expenses.other.toLocaleString()}</span>
              <div className="report-breakdown-bar">
                <div className="report-breakdown-fill" style={{ width: `${(report.expenses.other / report.expenses.total) * 100}%`, background: '#8b5cf6' }} />
              </div>
            </div>
          </div>
          <div className="report-card-total">
            <span>Total Expenses</span>
            <span>KES {report.expenses.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="report-summary">
        <div className="report-summary-grid">
          <div className="report-summary-item">
            <div className="report-summary-label">Total Income</div>
            <div className="report-summary-value" style={{ color: '#22c55e' }}>KES {report.income.total.toLocaleString()}</div>
            <div className="report-summary-change up">↑ 8% from May</div>
          </div>
          <div className="report-summary-item">
            <div className="report-summary-label">Total Expenses</div>
            <div className="report-summary-value" style={{ color: '#ef4444' }}>KES {report.expenses.total.toLocaleString()}</div>
            <div className="report-summary-change down">↑ 12% from May</div>
          </div>
          <div className="report-summary-item">
            <div className="report-summary-label">Net Profit/Loss</div>
            <div className="report-summary-value" style={{ color: report.net < 0 ? '#ef4444' : '#22c55e' }}>
              KES {report.net.toLocaleString()}
            </div>
            <div className="report-summary-change down">↓ 5% from May</div>
          </div>
          <div className="report-summary-item">
            <div className="report-summary-label">Profit Margin</div>
            <div className="report-summary-value" style={{ color: report.profitMargin < 0 ? '#ef4444' : '#22c55e' }}>
              {report.profitMargin}%
            </div>
            <div className="report-summary-change down">↓ 2% from May</div>
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      <div className="report-notes">
        <div className="report-notes-title">📝 Notes</div>
        <textarea 
          className="report-notes-textarea"
          placeholder="Add notes about this month's financial performance..."
          rows={3}
        />
      </div>
    </div>
  );
}