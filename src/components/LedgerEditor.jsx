import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveLedger, getLedgerById } from '../utils'
import LedgerTable from './LedgerTable'
import { useToast } from '../context/ToastContext'

function LedgerEditor({ setIsEditMode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [personName, setPersonName] = useState('')
  const [rows, setRows] = useState([])
  const [ledgerId, setLedgerId] = useState(id || Date.now().toString())

  useEffect(() => {
    if (id) {
      const fetchLedger = async () => {
        const saved = await getLedgerById(id);
        if (saved) {
          setPersonName(saved.name);
          setRows(saved.entries.map(row => ({
            ...row,
            persisted: true
          })));
          setLedgerId(saved._id || saved.id);
          if (setIsEditMode) setIsEditMode(true);
        }
      };
      fetchLedger();
    }
  }, [id]);

  const handleSaveLedger = async () => {
    if (!personName.trim()) {
      showToast('Please enter a name first!', 'error')
      return
    }

    if (rows.length === 0) {
      showToast('Please add at least one entry before saving the ledger.', 'error')
      return
    }

    // Sort all entries chronologically for final save
    const finalEntries = [...rows].sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return Number(a.id) - Number(b.id)
    })

    // Recalculate totals for the final save set
    let totalPurchase = 0
    let totalPaid = 0
    finalEntries.forEach(entry => {
      totalPurchase += (Number(entry.purchase) || 0)
      totalPaid += (Number(entry.payment) || 0)
    })

    try {
      await saveLedger({
        id: ledgerId,
        name: personName,
        entries: finalEntries,
        totalPurchase,
        totalPaid
      });

      showToast('Ledger saved successfully!', 'success')
      if (setIsEditMode) setIsEditMode(false)
      navigate('/saved')
    } catch (error) {
      showToast('Failed to save ledger. Please try again.', 'error');
    }
  };

  return (
    <div className="card">
      <div className="header-section">
        <span>Ledger Account For</span>
        <input
          className="name-input"
          type="text"
          placeholder="Enter Name..."
          value={personName}
          onChange={(e) => {
            setPersonName(e.target.value)
            if (setIsEditMode) setIsEditMode(true)
          }}
        />
      </div>

      <div style={{ marginTop: '3rem' }}>
        <LedgerTable rows={rows} setRows={(newRows) => {
          setRows(newRows)
          if (setIsEditMode) setIsEditMode(true)
        }} />
      </div>

      <div className="button-container" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button className="btn btn-primary" onClick={handleSaveLedger}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Ledger
        </button>
      </div>
    </div>
  )
}

export default LedgerEditor
