import { useState } from 'react'
import { HashRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './components/Home'
import LedgerEditor from './components/LedgerEditor'
import LedgerList from './components/LedgerList'
import LedgerView from './components/LedgerView'
// import CateringEditor from './components/CateringEditor'
// import CateringList from './components/CateringList'
// import CateringView from './components/CateringView'
import Toast from './components/ui/Toast'
import { useToast } from './context/ToastContext'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './components/Auth'
import './App.css'

function App() {
  const [isEditMode, setIsEditMode] = useState(false)
  const { toast, showToast, hideToast } = useToast()
  const { isAuthenticated, logout, currentUser } = useAuth()

  const handleNavClick = (e, targetPath) => {
    // Requirements: Block navigation to "New Ledger" or "New Catering" if in Edit Mode
    const isTargetNew = targetPath === '/ledger' || targetPath === '/catering'

    if (isEditMode && isTargetNew) {
      e.preventDefault()
      showToast("Please save the ledger/catering before proceeding", "error")
    } else {
      // For other navigations (like Saved lists or Home), we allow it but reset the edit state
      setIsEditMode(false)
    }
  }

  return (
    <Router>
      <div className="container">
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
        <nav className="nav-bar no-print">
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <NavLink
                to="/ledger"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '/ledger')}
                end
              >
                New Ledger
              </NavLink>
              <NavLink
                to="/saved"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '/saved')}
              >
                Saved Ledgers
              </NavLink>
              <div style={{ width: '1px', height: '1.5rem', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>
              {/* <NavLink
                to="/catering"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '/catering')}
                end
              >
                New Catering
              </NavLink>
              <NavLink
                to="/catering/saved"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '/catering/saved')}
              >
                Saved Catering
              </NavLink> */}
            </div>
          ) : (
            <div></div> /* Empty div to maintain flex spacing if needed */
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem' }}>
              {isAuthenticated && currentUser && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {currentUser.name || currentUser.username}
                </div>
              )}
              <Link to="/" style={{ textDecoration: 'none' }} onClick={(e) => handleNavClick(e, '/')}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }}>
                  Hishab Khata
                </div>
              </Link>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  window.location.hash = '#/';
                }}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Ledger Routes */}
          <Route path="/ledger" element={<ProtectedRoute><LedgerEditor setIsEditMode={setIsEditMode} key="new-ledger" /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><LedgerEditor setIsEditMode={setIsEditMode} key="edit-ledger" /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><LedgerList /></ProtectedRoute>} />
          <Route path="/view/:id" element={<ProtectedRoute><LedgerView /></ProtectedRoute>} />

          {/* Catering Routes */}
          {/* <Route path="/catering" element={<ProtectedRoute><CateringEditor setIsEditMode={setIsEditMode} key="new-catering" /></ProtectedRoute>} />
          <Route path="/catering/edit/:id" element={<ProtectedRoute><CateringEditor setIsEditMode={setIsEditMode} key="edit-catering" /></ProtectedRoute>} />
          <Route path="/catering/saved" element={<ProtectedRoute><CateringList /></ProtectedRoute>} />
          <Route path="/catering/view/:id" element={<ProtectedRoute><CateringView /></ProtectedRoute>} /> */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
