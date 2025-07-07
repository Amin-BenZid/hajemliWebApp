import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Auto-load from localStorage on app start
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (savedUser && savedToken && savedRole) {
      setUser(savedUser);
      setToken(savedToken);
      setRole(savedRole);
    }
    setLoading(false); // Set loading to false after check
  }, []);

  const login = (userData, authToken, userRole) => {
    setUser(userData);
    setToken(authToken);
    setRole(userRole);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
