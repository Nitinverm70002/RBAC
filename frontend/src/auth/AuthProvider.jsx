import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);

  // login: call backend /auth/login -> set access (in memory) and user
  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    setAccess(res.data.access);
    setUser(res.data.user);
  }

  function logout() {
    setUser(null);
    setAccess(null);
  }

  // attach auth header helper
  const authHeader = access ? { Authorization: `Bearer ${access}` } : {};

  return (
    <AuthContext.Provider value={{ user, setUser, access, setAccess, login, logout, authHeader }}>
      {children}
    </AuthContext.Provider>
  );
}
