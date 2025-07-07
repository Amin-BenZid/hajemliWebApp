import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoints = [
      "/clients/reset-password",
      "/barbers/reset-password",
      "/shop-owners/reset-password"
    ];
    let sent = false;
    for (const endpoint of endpoints) {
      try {
        const response = await api.post(endpoint, { mail: email });
        if (response.status === 201) {
          setSuccess(true);
          setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
          sent = true;
          break;
        }
      } catch (e) {
        // try next endpoint
      }
    }
    if (!sent) {
      setError("Failed to send reset key from all available endpoints");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Forgot Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Email sent! Check your inbox.</div>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
    </div>
  );
} 