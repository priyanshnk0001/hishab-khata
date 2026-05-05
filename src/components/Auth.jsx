import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    mobile: ''
  });

  const { login, signup, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // If somehow they get here while logged in, redirect them
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    if (e.target.name === 'mobile') {
      const val = e.target.value.replace(/\D/g, '');
      if (val.length <= 10) {
        setFormData({ ...formData, mobile: val });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', username: '', password: '', mobile: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const result = login(formData.username, formData.password);
      if (result.success) {
        showToast('Login successful!', 'success');
        navigate('/');
      } else {
        showToast(result.message, 'error');
      }
    } else {
      // Validate inputs
      if (!formData.name || !formData.username || !formData.password || !formData.mobile) {
        showToast('All fields are required', 'error');
        return;
      }
      if (formData.mobile.length !== 10) {
        showToast('Mobile number must be exactly 10 digits', 'error');
        return;
      }
      if (formData.password.length < 4) {
        showToast('Password must be at least 4 characters', 'error');
        return;
      }

      const result = signup(formData.name, formData.username, formData.password, formData.mobile);
      if (result.success) {
        showToast('Signup successful! Please login.', 'success');
        setIsLogin(true);
      } else {
        showToast(result.message, 'error');
      }
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="card auth-card">
        <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="base-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="base-input"
              autoComplete="username"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="base-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="base-input"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span role="button" className="auth-toggle" onClick={handleToggle} tabIndex={0}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
