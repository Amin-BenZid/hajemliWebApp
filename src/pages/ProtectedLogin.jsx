import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import ClientAuthPage from "./ClientAuth";

export default function ProtectedLogin() {
  const { user, role } = useAuth();

  if (user) {
    if (role === "client") return <Navigate to="/" />;
    if (role === "worker") return <Navigate to="/barber/dashboard" />;
    if (role === "owner") return <Navigate to="/owner/dashboard" />;
    return null;
  }

  return <ClientAuthPage />;
} 