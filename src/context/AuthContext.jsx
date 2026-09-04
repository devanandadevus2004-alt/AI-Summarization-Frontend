import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai_notes_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ai_notes_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('ai_notes_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('ai_notes_token', res.token);
      localStorage.setItem('ai_notes_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (name, email, password, role = 'user') => {
    const res = await api.register({ name, email, password, role });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('ai_notes_token', res.token);
      localStorage.setItem('ai_notes_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('ai_notes_token');
    localStorage.removeItem('ai_notes_user');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (data) => {
    const res = await api.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('ai_notes_user', JSON.stringify(res.user));
    }
    return res;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
