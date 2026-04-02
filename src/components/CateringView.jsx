import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCateringLedgerById } from '../utils'
import LedgerTable from './LedgerTable'

function CateringView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ledger, setLedger] = useState(null)

  useEffect(() => {
    const data = getCateringLedgerById(id)
    if (data) {
      setLedger(data)
    } else {
      navigate('/catering/saved')
    }
  }, [id, navigate])

  const bookingCalculations = useMemo(() => {
    if (!ledger) return { totalAdditional: 0, totalPaidOnBooking: 0, bookingBalance: 0 }
    const totalAdditional = (ledger.additionalPayments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    const totalPaidOnBooking = (Number(ledger.advancePayment) || 0) + totalAdditional
    const bookingBalance = (Number(ledger.bookingAmount) || 0) - totalPaidOnBooking
    
    return {
      totalAdditional,
      totalPaidOnBooking,
      bookingBalance
    }
  }, [ledger])

  if (!ledger) return null

  return (
    <div className="container">
      <div className="card">
        <div className="header-section">
          <span>Catering Booking Details</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, borderBottom: '2px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            {ledger.clientName}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Booking Date: {ledger.bookingDate} | Last Updated: {ledger.updatedAt ? new Date(ledger.updatedAt).toLocaleString() : 'Never'}
          </p>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>1. Booking Payment Summary</h2>
          <div className="summary-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
            <div className="summary-card">
              <span className="summary-label">Total Booking Amount</span>
              <span className="summary-value">₹{(ledger.bookingAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Advance Paid</span>
              <span className="summary-value" style={{ color: 'var(--accent-green)' }}>₹{(ledger.advancePayment || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-card total-balance">
              <span className="summary-label">Booking Balance</span>
              <span className="summary-value">₹{bookingCalculations.bookingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {(ledger.additionalPayments && ledger.additionalPayments.length > 0) && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>2. Additional Payments History</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Note / Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.additionalPayments.map((pay) => (
                    <tr key={pay.id}>
                      <td>{pay.date}</td>
                      <td>{pay.note}</td>
                      <td>₹{Number(pay.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 600, background: 'rgba(255,255,255,0.03)' }}>
                    <td colSpan="2" style={{ textAlign: 'right' }}>Total Additional Payments:</td>
                    <td>₹{bookingCalculations.totalAdditional.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>3. Catering Sale/Purchase Record</h2>
          <LedgerTable rows={ledger.ledgerEntries || []} setRows={() => {}} readOnly={true} />
        </div>

        <div className="button-container no-print" style={{ marginTop: '3rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Booking
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/catering/edit/${id}`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Booking
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/catering/saved')}>
            Back to List
          </button>
        </div>
      </div>
    </div>
  )
}

export default CateringView
