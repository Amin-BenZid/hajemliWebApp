import { useState } from "react";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Hajemli</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`px-5 py-2 text-sm font-semibold rounded-l-full ${
              !isSignUp ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`px-5 py-2 text-sm font-semibold rounded-r-full ${
              isSignUp ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {isSignUp && (
            <>
              <div className="flex gap-2">
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black"
                  required
                />
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black"
                required
              />

              <input
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                type="date"
                placeholder="Birthdate"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black"
              />
            </>
          )}

          <input
            name="mail"
            value={form.mail}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black"
            required
          />

          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button className="underline text-black" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
