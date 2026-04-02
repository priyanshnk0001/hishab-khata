import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        message: '',
        type: 'success',
        isVisible: false,
    });
    const timerRef = useRef(null);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        // If a toast is already visible, hide it first to reset
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setToast({
            message,
            type,
            isVisible: true,
        });

        // Auto-hide after 3 seconds
        timerRef.current = setTimeout(() => {
            hideToast();
        }, 3000);
    }, [hideToast]);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};
