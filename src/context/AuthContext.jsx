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

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('hishab_users') || '[]');
    const user = users.find((u) => u.username === username);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('hishab_current_user', JSON.stringify(user));
    return { success: true };
  };

  const signup = (name, username, password, mobile) => {
    const users = JSON.parse(localStorage.getItem('hishab_users') || '[]');
    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = { name, username, password, mobile };
    users.push(newUser);
    localStorage.setItem('hishab_users', JSON.stringify(users));

    return { success: true };
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
