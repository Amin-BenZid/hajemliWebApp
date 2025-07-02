import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(null);

  // Auto-load from localStorage on app start
  useEffect(() => {
    const savedClient = JSON.parse(localStorage.getItem("client"));
    const savedToken = localStorage.getItem("token");
    if (savedClient && savedToken) {
      setClient(savedClient);
      setToken(savedToken);
    }
  }, []);

  const login = (clientData, authToken) => {
    setClient(clientData);
    setToken(authToken);
    localStorage.setItem("client", JSON.stringify(clientData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setClient(null);
    setToken(null);
    localStorage.removeItem("client");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ client, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
