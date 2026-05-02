import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Auth initialization error', error);
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('token', data.token); // Save token explicitly
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };

    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('token', data.token); // Save token explicitly
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };

    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };


  const googleLogin = async (credential) => {
    try {
      const { data } = await API.post('/auth/google', { credential });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = () => {

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');

  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);
