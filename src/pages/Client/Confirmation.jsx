import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { date, time, services } = location.state || {
    date: null,
    time: null,
    services: [],
  };

  const totalPrice = services.reduce((sum, s) => sum + Number(s.price || 0), 0);

  useEffect(() => {
    toast.success("🎉 Appointment Confirmed!");
  }, []);

  const getGoogleCalendarURL = (dateStr, timeStr, services) => {
    const serviceList = services.map((s) => s.name).join(", ");
    const [hour, minutePart] = timeStr.split(":");
    const minutes = parseInt(minutePart);
    const isPM = timeStr.includes("PM");
    let startHour = parseInt(hour) + (isPM && hour !== "12" ? 12 : 0);
    let startMinutes = minutes;

    startHour -= 1;
    if (startHour < 0) startHour += 24;

    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const startTime = `${year}${month}${day}T${String(startHour).padStart(
      2,
      "0"
    )}${String(startMinutes).padStart(2, "0")}00`;
    const endTime = `${year}${month}${day}T${String(startHour + 1).padStart(
      2,
      "0"
    )}${String(startMinutes).padStart(2, "0")}00`;

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=Hajemli+Appointment&details=${encodeURIComponent(
      serviceList
    )}&dates=${startTime}/${endTime}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300 flex flex-col justify-center items-center px-6 py-12"
    >
      <Toaster position="top-center" />

      {/* Stepper Progress */}
      <div className="flex justify-between items-center mb-8 px-2 w-full max-w-md">
        {[
          { label: "Service", step: 1 },
          { label: "Time", step: 2 },
          { label: "Confirm", step: 3 },
        ].map((item, i) => (
          <div key={i} className="flex-1 relative text-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 border-2 ${
                  item.step === 3
                    ? "bg-green-500 text-white border-green-500"
                    : item.step < 3
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-white border-gray-300 dark:border-zinc-600"
                }`}
              >
                {item.step}
              </div>
              <span className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
                {item.label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`absolute top-4  h-0.5 w-full ${
                  item.step < 3
                    ? "bg-green-600"
                    : item.step === 3
                    ? "bg-black"
                    : "bg-gray-300 dark:bg-zinc-600"
                }`}
                style={{ transform: "translateX(50%)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ✅ Checkmark */}
      <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md animate-pulse">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-2">
        Reservation Confirmed
      </h1>
      <p className="text-zinc-600 dark:text-zinc-300 mb-8 text-center">
        You're booked on <span className="font-semibold">{date}</span> at{" "}
        <span className="font-semibold">{time}</span>.
      </p>

      <div className="bg-white dark:bg-zinc-800 w-full max-w-md rounded-2xl shadow-lg p-6 mb-8 border dark:border-zinc-700">
        <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">
          Services Summary
        </h2>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 mb-4">
          {services.map((s, i) => (
            <li key={i} className="flex justify-between">
              <span>{s.name}</span>
              <span className="font-medium">{s.price} DT</span>
            </li>
          ))}
        </ul>
        <p className="text-right font-bold text-zinc-800 dark:text-white border-t pt-3 border-zinc-200 dark:border-zinc-600">
          Total: {totalPrice} DT
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white w-full py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate("/appointments")}
          className="border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-white w-full py-3 rounded-xl font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
        >
          View Appointment
        </button>
        <a
          href={getGoogleCalendarURL(date, time, services)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white w-full text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Remind Me
        </a>
      </div>
    </motion.div>
  );
}
