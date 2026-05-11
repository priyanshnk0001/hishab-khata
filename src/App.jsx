import { useState } from 'react'
import { HashRouter as Router, Routes, Route, NavLink, Link, Navigate } from 'react-router-dom'
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
import './components/Navbar.css'
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
            <div className="nav-links">
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
              <div className="nav-divider"></div>
            </div>
          ) : (
            <div></div>
          )}
          
          <div className="nav-identity">
            <div className="identity-text">
              {isAuthenticated && currentUser && (
                <div className="nav-user-name">
                  {currentUser.name || currentUser.mobile}
                </div>
              )}
              <Link to="/" className="brand-link" onClick={(e) => handleNavClick(e, '/')}>
                <div className="nav-brand-name">Hishab Khata</div>
              </Link>
            </div>
            
            {isAuthenticated && (
              <button
                className="btn btn-secondary logout-btn"
                onClick={() => {
                  logout();
                  window.location.hash = '#/';
                }}
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/saved" replace /> : <Auth />} />

          {/* Home Route - Redirect to Saved if authenticated */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/saved" replace /> : <Home />} />

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
