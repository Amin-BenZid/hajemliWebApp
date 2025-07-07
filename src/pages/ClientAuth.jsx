import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAllRoles, registerClient } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ClientAuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    mail: "",
    password: "",
    birthdate: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        // Prepare birthdate in ISO format if present
        const signupData = { ...form };
        if (signupData.birthdate) {
          signupData.birthdate = new Date(signupData.birthdate).toISOString();
        }
        await registerClient(signupData);
      }
      const { user, token, role } = await loginAllRoles(form.mail, form.password);
      login(user, token, role);
      console.log("User after login:", user);
      console.log("User shop_id:", user.shop_id);
      // Navigate based on role
      if (role === "client") {
        const shopId = user.shop_id || user.shopId || user.shop || null;
        if (shopId) {
          navigate(`/shop/${shopId}`);
        } else {
          navigate("/");
        }
      } else if (role === "worker") {
        navigate("/barber/dashboard");
      } else if (role === "owner") {
        navigate("/owner/dashboard");
      }
    } catch (err) {
      setError(isSignUp ? "Registration failed. Please check your details." : "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Hajemli
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`px-5 py-2 text-sm font-semibold rounded-l-full transition ${
              !isSignUp
                ? "bg-black text-white"
                : "bg-gray-200 text-black dark:bg-zinc-700 dark:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`px-5 py-2 text-sm font-semibold rounded-r-full transition ${
              isSignUp
                ? "bg-black text-white"
                : "bg-gray-200 text-black dark:bg-zinc-700 dark:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="flex gap-2">
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
                  required
                />
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
                  required
                />
              </div>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
                required
              />

              <input
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                type="date"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
              />
            </>
          )}

          <input
            name="mail"
            value={form.mail}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
            required
          />

          {/* Password input with eye icon inside the input box */}
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black dark:bg-zinc-700 dark:text-white dark:border-zinc-600 pr-10"
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-500 dark:text-zinc-300"
              onClick={() => setShowPassword((v) => !v)}
              style={{ userSelect: 'none' }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {!isSignUp && (
            <div className="text-right mb-2">
              <button
                type="button"
                className="text-sm text-black dark:text-white underline hover:opacity-80"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-zinc-300 mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="underline text-black dark:text-white"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
