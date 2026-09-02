import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, logoutUser, signupUser } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      if (res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await loginUser(email, password);
      if (res.token) {
        localStorage.setItem('mailmind_token', res.token);
      }
      setUser(res.data);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (name, email, password) => {
    setError(null);
    try {
      const res = await signupUser(name, email, password);
      if (res.token) {
        localStorage.setItem('mailmind_token', res.token);
      }
      setUser(res.data);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('mailmind_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        refreshUser: fetchUser,
        gmailConnected: !!user?.gmailConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
