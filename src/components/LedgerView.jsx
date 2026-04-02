import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLedgerById } from '../utils'

function LedgerView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ledger, setLedger] = useState(null)

  useEffect(() => {
    const data = getLedgerById(id)
    if (data) {
      setLedger(data)
    } else {
      navigate('/saved')
    }
  }, [id, navigate])

  const rowsWithBalance = useMemo(() => {
    if (!ledger) return []
    let currentRunningBalance = 0
    
    // Sort rows by Date and ID (creation time)
    const sortedEntries = [...ledger.entries].sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return Number(a.id) - Number(b.id)
    })

    return sortedEntries.map(row => {
      const balance = (Number(row.purchase) || 0) - (Number(row.payment) || 0)
      currentRunningBalance += balance
      return {
        ...row,
        balance,
        runningBalance: currentRunningBalance
      }
    })
  }, [ledger])

  const netBalance = useMemo(() => {
    if (!ledger) return 0
    return (Number(ledger.totalPurchase) || 0) - (Number(ledger.totalPaid) || 0)
  }, [ledger])

  if (!ledger) return null

  return (
    <div className="container">
      <div className="card">
        <div className="header-section">
          <span>Ledger Account For</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, borderBottom: '2px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            {ledger.name}
          </h1>
        </div>

        <div className="table-wrapper" style={{ marginTop: '3rem' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Purchase Amount</th>
                <th>Payment Made</th>
                <th>Balance</th>
                <th>Total Balance</th>
              </tr>
            </thead>
            <tbody>
              {rowsWithBalance.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{Number(row.purchase).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>{Number(row.payment).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className={`balance-cell ${row.balance >= 0 ? 'balance-pos' : 'balance-neg'}`}>
                    {row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`balance-cell ${row.runningBalance >= 0 ? 'balance-pos' : 'balance-neg'}`} style={{ fontWeight: 600 }}>
                    {row.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="summary-footer">
          <div className="summary-card">
            <span className="summary-label">Total Purchase</span>
            <span className="summary-value" style={{ color: 'var(--accent-red)' }}>
              {Number(ledger.totalPurchase || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Paid</span>
            <span className="summary-value" style={{ color: 'var(--accent-green)' }}>
              {Number(ledger.totalPaid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="summary-card total-balance">
            <span className="summary-label">Net Balance</span>
            <span className="summary-value">
              {netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="button-container no-print" style={{ marginTop: '3rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Ledger
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/edit/${id}`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Ledger
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/saved')}>
            Back to List
          </button>
        </div>
      </div>
    </div>
  )
}

export default LedgerView
