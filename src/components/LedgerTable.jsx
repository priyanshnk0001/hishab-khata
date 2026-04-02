import { useState, useMemo } from 'react'
import { useToast } from '../context/ToastContext'

function LedgerTable({ rows, setRows, readOnly = false }) {
  const { showToast } = useToast()
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    purchase: 0,
    payment: 0
  })

  const calculations = useMemo(() => {
    let totalPurchase = 0
    let totalPayment = 0
    let currentRunningBalance = 0

    // Sort rows by Date and ID (creation time)
    const sortedRows = [...rows].sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return Number(a.id) - Number(b.id)
    })

    const processedRows = sortedRows.map(row => {
      const balance = (Number(row.purchase) || 0) - (Number(row.payment) || 0)
      totalPurchase += (Number(row.purchase) || 0)
      totalPayment += (Number(row.payment) || 0)
      currentRunningBalance += balance
      return { ...row, balance, runningBalance: currentRunningBalance }
    })

    return {
      rows: processedRows,
      totalPurchase,
      totalPayment,
      netBalance: totalPurchase - totalPayment
    }
  }, [rows])

  const handleSaveEntry = () => {
    if (!newEntry.purchase && !newEntry.payment) {
      showToast('Please enter a purchase or payment amount.', 'error')
      return
    }

    const entry = {
      ...newEntry,
      id: Date.now(),
      persisted: false
    }

    setRows([...rows, entry])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      purchase: 0,
      payment: 0
    })
  }

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id))
  }

  return (
    <div className="ledger-table-container">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Date</th>
              <th style={{ width: '20%' }}>Purchase Amount</th>
              <th style={{ width: '20%' }}>Payment Made</th>
              <th style={{ width: '15%' }}>Balance</th>
              <th style={{ width: '15%' }}>Total Balance</th>
              {!readOnly && <th style={{ width: '10%' }}></th>}
            </tr>
          </thead>
          <tbody>
            {calculations.rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    className={(row.persisted || readOnly) ? 'locked-input' : ''}
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                    readOnly={row.persisted || readOnly}
                  />
                </td>
                <td>
                  <input
                    className={(row.persisted || readOnly) ? 'locked-input' : ''}
                    type="number"
                    placeholder="0.00"
                    value={row.purchase || ''}
                    onChange={(e) => updateRow(row.id, 'purchase', e.target.value)}
                    readOnly={row.persisted || readOnly}
                  />
                </td>
                <td>
                  <input
                    className={(row.persisted || readOnly) ? 'locked-input' : ''}
                    type="number"
                    placeholder="0.00"
                    value={row.payment || ''}
                    onChange={(e) => updateRow(row.id, 'payment', e.target.value)}
                    readOnly={row.persisted || readOnly}
                  />
                </td>
                <td className={`balance-cell ${row.balance >= 0 ? 'balance-pos' : 'balance-neg'}`}>
                  {row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className={`balance-cell ${row.runningBalance >= 0 ? 'balance-pos' : 'balance-neg'}`} style={{ fontWeight: 600 }}>
                  {row.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                {!readOnly && (
                  <td>
                    {!row.persisted && (
                      <button className="delete-btn" onClick={() => deleteRow(row.id)}>Delete</button>
                    )}
                  </td>
                )}
              </tr>
            ))}

            {!readOnly && (
              <tr className="new-entry-row">
                <td>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newEntry.purchase || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, purchase: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newEntry.payment || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, payment: e.target.value })}
                  />
                </td>
                <td colSpan="2" style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>
                  (New Entry)
                </td>
                <td>
                  <button className="btn btn-primary" onClick={handleSaveEntry} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Save Entry
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="summary-footer">
        <div className="summary-card">
          <span className="summary-label">Total Purchase</span>
          <span className="summary-value" style={{ color: 'var(--accent-red)' }}>
            {calculations.totalPurchase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Paid</span>
          <span className="summary-value" style={{ color: 'var(--accent-green)' }}>
            {calculations.totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="summary-card total-balance">
          <span className="summary-label">Ledger Balance</span>
          <span className="summary-value">
            {calculations.netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default LedgerTable
