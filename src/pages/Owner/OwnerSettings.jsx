import { useState } from "react";
import {
  LogOut,
  ShieldCheck,
  SunMoon,
  User,
  Save,
  Clock,
  CalendarDays,
} from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";

export default function OwnerSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyPublic, setPrivacyPublic] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "18:00",
  });
  const [restDays, setRestDays] = useState([]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleRestDay = (day) => {
    setRestDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-6 pb-28 transition-colors duration-300">
      <OwnerBottomNav />
      <div className="max-w-xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold text-center">Settings</h1>

        {/* Account */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User size={18} /> Account
          </h2>
          <div className="flex justify-between items-center border-b pb-3 border-zinc-200 dark:border-zinc-700">
            <p>Notifications</p>
            <input
              type="checkbox"
              className="accent-black scale-125"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>

          <div className="flex justify-between items-center border-b pb-3 border-zinc-200 dark:border-zinc-700">
            <p>Public Profile</p>
            <input
              type="checkbox"
              className="accent-black scale-125"
              checked={privacyPublic}
              onChange={() => setPrivacyPublic(!privacyPublic)}
            />
          </div>

          <div className="flex justify-between items-center border-b pb-3 border-zinc-200 dark:border-zinc-700">
            <p>Auto-Accept Appointments</p>
            <input
              type="checkbox"
              className="accent-black scale-125"
              checked={autoAccept}
              onChange={() => setAutoAccept(!autoAccept)}
            />
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <SunMoon size={18} /> Preferences
          </h2>

          <div className="flex justify-between items-center border-b pb-3 border-zinc-200 dark:border-zinc-700">
            <p>Dark Mode</p>
            <input
              type="checkbox"
              className="accent-black scale-125"
              checked={darkMode}
              onChange={() => {
                setDarkMode(!darkMode);
                document.documentElement.classList.toggle("dark", !darkMode);
              }}
            />
          </div>
        </section>

        {/* Working Hours */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock size={18} /> Working Hours
          </h2>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Start Time</label>
              <input
                type="time"
                value={workingHours.start}
                onChange={(e) =>
                  setWorkingHours({ ...workingHours, start: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl dark:bg-zinc-800"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">End Time</label>
              <input
                type="time"
                value={workingHours.end}
                onChange={(e) =>
                  setWorkingHours({ ...workingHours, end: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl dark:bg-zinc-800"
              />
            </div>
          </div>
        </section>

        {/* Rest Days */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays size={18} /> Rest Days
          </h2>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => toggleRestDay(day)}
                className={`px-4 py-2 rounded-full text-sm border ${
                  restDays.includes(day)
                    ? "bg-red-500 text-white border-red-600"
                    : "bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck size={18} /> Security
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your account is protected with industry-grade encryption.
          </p>
        </section>

        {/* Save / Logout */}
        <div className="space-y-4">
          <button className="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl flex items-center justify-center gap-2">
            <Save size={18} />
            Save Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
