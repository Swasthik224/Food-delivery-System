import { useState } from 'react';
import { AuthContext } from './auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fd_user')); } catch { return null; }
  });

 
const login = (token, user) => {
  localStorage.setItem("fd_token", token);
  localStorage.setItem("fd_user", JSON.stringify(user));
};
  const logout = () => {
    localStorage.removeItem('fd_token');
    localStorage.removeItem('fd_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
