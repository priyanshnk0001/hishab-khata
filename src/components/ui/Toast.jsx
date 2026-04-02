import React from 'react';

const Toast = ({ type = 'success', message, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div 
            className="toast-container"
            style={{
                position: 'fixed',
                top: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                pointerEvents: 'none', // Allow clicks through the container
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div 
                className={`toast-notification ${type}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    background: type === 'success' 
                        ? 'rgba(34, 197, 94, 0.15)' 
                        : 'rgba(239, 68, 68, 0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    color: type === 'success' ? '#22c55e' : '#ef4444',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    maxWidth: '400px',
                    width: 'fit-content',
                    pointerEvents: 'auto', // Re-enable clicks for the toast itself
                    animation: 'toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {type === 'success' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    )}
                    <span>{message}</span>
                </div>
                
                <button 
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '6px',
                        transition: 'background 0.2s',
                        marginLeft: '0.5rem',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <style>{`
                @keyframes toastIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(-20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
            `}</style>
        </div>
    );
};

export default Toast;
