import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const endpoints = [
      "/clients/reset-password",
      "/barbers/reset-password",
      "/shop-owners/reset-password"
    ];
    let reset = false;
    for (const endpoint of endpoints) {
      try {
        const response = await api.patch(endpoint, {
          resetToken: code,
          newPassword: password,
        });
        if (response.status === 200) {
          navigate("/confirm-reset");
          reset = true;
          break;
        }
      } catch (e) {
        // try next endpoint
      }
    }
    if (!reset) {
      setError("Failed to reset password from all available endpoints");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Reset Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter reset code"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600 pr-10"
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-500 dark:text-zinc-300"
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
} 