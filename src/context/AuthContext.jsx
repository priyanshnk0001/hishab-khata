import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedSession = localStorage.getItem('hishab_current_user');
    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (mobile, password) => {
    try {
      const response = await fetch('https://hishab-khata-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobile, password })
      });

      const result = await response.json();
      if (response.ok) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('hishab_current_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const signup = async (name, mobile, password) => {
    try {
      const response = await fetch('https://hishab-khata-backend.onrender.com/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile_number: mobile, password })
      });

      const result = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hishab_current_user');
  };

  const value = {
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
