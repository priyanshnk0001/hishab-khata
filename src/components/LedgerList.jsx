import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getLedgers, deleteLedger } from '../utils'
import axios from 'axios'
import Loader from './Loader'
import './LedgerList.css'

function LedgerList() {
  const [ledgers, setLedgers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [deletingId, setDeletingId] = useState(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  useEffect(() => {
    const fetchLedgers = async () => {
      setLoading(true);
      const data = await getLedgers();
      setLedgers(data);
      setLoading(false);
    };
    fetchLedgers();
  }, []);

  if (loading) return <Loader />;

  const handleDelete = async (id) => {
    if (deletePassword === 'confirmed0001') {
      try {
        await deleteLedger(id);
        const data = await getLedgers();
        setLedgers(data);
        setDeletingId(null);
        setDeletePassword('');
        setPasswordError(false);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    } else {
      setPasswordError(true)
    }
  }

  return (
    <div className="card ll-container">
      <div className="ll-header-section">
        <span>Saved Accounts</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>All Ledgers</h1>
      </div>

      <div className="ledger-list" style={{ marginTop: '2.5rem' }}>
        {ledgers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No saved ledgers found. Start by creating a new one!</p>
            <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
              Create New Ledger
            </Link>
          </div>
        ) : (
          [...ledgers].sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0)
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0)
            return dateB - dateA
          }).map((ledger, index) => (
            <div key={ledger.id || ledger._id || index} className="ledger-item">
              <div className="ledger-info">
                <h3>{ledger.name}</h3>
                <p>Last updated: {ledger.updatedAt ? `${new Date(ledger.updatedAt).toLocaleDateString()} at ${new Date(ledger.updatedAt).toLocaleTimeString()}` : 'Never'}</p>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--accent-red)' }}>Purchase: ₹{(ledger.totalPurchase || 0).toLocaleString('en-IN')}</span>
                  <span style={{ color: 'var(--accent-green)' }}>Paid: ₹{(ledger.totalPaid || 0).toLocaleString('en-IN')}</span>
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
                    <button className="btn btn-secondary" onClick={() => navigate(`/view/${ledger.id}`)}>
                      View
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate(`/edit/${ledger.id}`)}>
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

      {ledgers.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
            + Create Another Ledger
          </Link>
        </div>
      )}
    </div>
  )
}

export default LedgerList
