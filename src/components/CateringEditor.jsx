import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveCateringLedger, getCateringLedgerById } from '../utils'
import LedgerTable from './LedgerTable'
import { useToast } from '../context/ToastContext'

function CateringEditor({ setIsEditMode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [clientName, setClientName] = useState('')
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0])
  const [bookingAmount, setBookingAmount] = useState(0)
  const [advancePayment, setAdvancePayment] = useState(0)
  const [additionalPayments, setAdditionalPayments] = useState([])
  const [ledgerEntries, setLedgerEntries] = useState([])

  const [newPayment, setNewPayment] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    note: ''
  })

  const [cateringId, setCateringId] = useState(id || Date.now().toString())

  useEffect(() => {
    if (id) {
      const saved = getCateringLedgerById(id)
      if (saved) {
        setClientName(saved.clientName || '')
        setBookingDate(saved.bookingDate || '')
        setBookingAmount(saved.bookingAmount || 0)
        setAdvancePayment(saved.advancePayment || 0)
        setAdditionalPayments(saved.additionalPayments || [])
        setLedgerEntries((saved.ledgerEntries || []).map(row => ({ ...row, persisted: true })))
        setCateringId(saved.id)
        if (setIsEditMode) setIsEditMode(true)
      }
    }
  }, [id])

  const bookingCalculations = useMemo(() => {
    const totalAdditional = (additionalPayments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    const totalPaidOnBooking = (Number(advancePayment) || 0) + totalAdditional
    const bookingBalance = (Number(bookingAmount) || 0) - totalPaidOnBooking

    return {
      totalAdditional,
      totalPaidOnBooking,
      bookingBalance
    }
  }, [bookingAmount, advancePayment, additionalPayments])

  const handleAddPayment = () => {
    if (!newPayment.amount) {
      showToast('Please enter a payment amount.', 'error')
      return
    }
    const payment = {
      ...newPayment,
      id: Date.now().toString()
    }
    setAdditionalPayments([...additionalPayments, payment])
    setNewPayment({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      note: ''
    })
  }

  const removePayment = (payId) => {
    setAdditionalPayments(additionalPayments.filter(p => p.id !== payId))
  }

  const handleSave = () => {
    if (!clientName.trim()) {
      showToast('Please enter a client name.', 'error')
      return
    }

    const data = {
      id: cateringId,
      clientName,
      bookingDate,
      bookingAmount: Number(bookingAmount),
      advancePayment: Number(advancePayment),
      additionalPayments,
      ledgerEntries: (ledgerEntries || []).map(e => ({ ...e, persisted: true })),
      updatedAt: new Date().toISOString()
    }

    saveCateringLedger(data)
    showToast('Catering record saved successfully!', 'success')
    if (setIsEditMode) setIsEditMode(false)
    navigate('/catering/saved')
  }

  return (
    <div className="card">
      <div className="header-section">
        <span>Catering Booking For</span>
        <input
          className="name-input"
          type="text"
          placeholder="Client Name..."
          value={clientName}
          onChange={(e) => {
            setClientName(e.target.value)
            if (setIsEditMode) setIsEditMode(true)
          }}
        />
        <div style={{ marginTop: '0.5rem' }}>
          <input
            type="date"
            className="edit-input"
            style={{ width: 'auto' }}
            value={bookingDate}
            onChange={(e) => {
              setBookingDate(e.target.value)
              if (setIsEditMode) setIsEditMode(true)
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>1. Booking Details</h2>
        <div className="summary-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
          <div className="summary-card">
            <span className="summary-label">Main Booking Amount</span>
            <input
              type="number"
              className={`edit-input ${id ? 'locked-input' : ''}`}
              value={bookingAmount || ''}
              onChange={(e) => {
                setBookingAmount(e.target.value)
                if (setIsEditMode) setIsEditMode(true)
              }}
              placeholder="0.00"
              readOnly={!!id}
            />
          </div>
          <div className="summary-card">
            <span className="summary-label">Advance Payment</span>
            <input
              type="number"
              className={`edit-input ${id ? 'locked-input' : ''}`}
              value={advancePayment || ''}
              onChange={(e) => {
                setAdvancePayment(e.target.value)
                if (setIsEditMode) setIsEditMode(true)
              }}
              placeholder="0.00"
              readOnly={!!id}
            />
          </div>
          <div className="summary-card total-balance">
            <span className="summary-label">Booking Balance</span>
            <span className="summary-value" style={{ fontSize: '1.5rem' }}>
              ₹{bookingCalculations.bookingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>2. Additional Payments</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Date</th>
                <th style={{ width: '40%' }}>Note / Description</th>
                <th style={{ width: '25%' }}>Amount</th>
                <th style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {(additionalPayments || []).map((pay) => (
                <tr key={pay.id}>
                  <td>{pay.date}</td>
                  <td>{pay.note}</td>
                  <td>₹{Number(pay.amount).toLocaleString('en-IN')}</td>
                  <td>
                    {!id && <button className="delete-btn" onClick={() => removePayment(pay.id)}>Delete</button>}
                  </td>
                </tr>
              ))}
              {!id && (
                <tr className="new-entry-row">
                  <td>
                    <input
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => {
                        setNewPayment({ ...newPayment, date: e.target.value })
                        if (setIsEditMode) setIsEditMode(true)
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="e.g. Second Installment"
                      value={newPayment.note}
                      onChange={(e) => {
                        setNewPayment({ ...newPayment, note: e.target.value })
                        if (setIsEditMode) setIsEditMode(true)
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newPayment.amount || ''}
                      onChange={(e) => {
                        setNewPayment({ ...newPayment, amount: e.target.value })
                        if (setIsEditMode) setIsEditMode(true)
                      }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={handleAddPayment} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Add
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>3. This Catering Sale Purchase</h2>
        <LedgerTable rows={ledgerEntries} setRows={(newRows) => {
          setLedgerEntries(newRows)
          if (setIsEditMode) setIsEditMode(true)
        }} />
      </div>

      <div className="button-container" style={{ justifyContent: 'flex-end', marginTop: '3rem' }}>
        <button className="btn btn-primary" onClick={handleSave} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Catering Record
        </button>
      </div>
    </div>
  )
}

export default CateringEditor
