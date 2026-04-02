import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCateringLedgers, deleteCateringLedger } from '../utils'

function CateringList() {
  const [cateringLedgers, setCateringLedgers] = useState([])
  const navigate = useNavigate()

  const [deletingId, setDeletingId] = useState(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  useEffect(() => {
    setCateringLedgers(getCateringLedgers())
  }, [])

  const handleDelete = (id) => {
    if (deletePassword === 'confirmed0001') {
      deleteCateringLedger(id)
      setCateringLedgers(getCateringLedgers())
      setDeletingId(null)
      setDeletePassword('')
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const calculateBalance = (ledger) => {
    const bookingAmt = Number(ledger.bookingAmount) || 0;
    const advance = Number(ledger.advancePayment) || 0;
    const additional = (ledger.additionalPayments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    return bookingAmt - (advance + additional);
  }

  return (
    <div className="card">
      <div className="header-section">
        <span>Catering Module</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Saved Catering Bookings</h1>
      </div>

      <div className="ledger-list" style={{ marginTop: '2.5rem' }}>
        {cateringLedgers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No catering records found. Start your first booking!</p>
            <Link to="/catering" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
              Create New Catering Record
            </Link>
          </div>
        ) : (
          [...cateringLedgers].sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0)
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0)
            return dateB - dateA
          }).map((ledger) => (
            <div key={ledger.id} className="ledger-item">
              <div className="ledger-info">
                <h3>{ledger.clientName}</h3>
                <p>Booking Date: {ledger.bookingDate}</p>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--primary)' }}>Amount: ₹{(ledger.bookingAmount || 0).toLocaleString('en-IN')}</span>
                  <span style={{ color: 'var(--accent-red)' }}>
                    Balance: ₹{calculateBalance(ledger).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="ledger-actions">
                {deletingId === ledger.id ? (
                  <div className="delete-confirm-wrapper">
                    <input
                      type="password"
                      placeholder="Enter Password"
                      className={`password-input ${passwordError ? 'error' : ''}`}
                      value={deletePassword}
                      onChange={(e) => {
                        setDeletePassword(e.target.value)
                        if (passwordError) setPasswordError(false)
                      }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-danger" onClick={() => handleDelete(ledger.id)}>
                        Confirm
                      </button>
                      <button className="btn btn-secondary" onClick={() => {
                        setDeletingId(null)
                        setDeletePassword('')
                        setPasswordError(false)
                      }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="btn btn-secondary" onClick={() => navigate(`/catering/view/${ledger.id}`)}>
                      View
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate(`/catering/edit/${ledger.id}`)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => setDeletingId(ledger.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {cateringLedgers.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/catering" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
            + Create Another Booking
          </Link>
        </div>
      )}
    </div>
  )
}

export default CateringList
