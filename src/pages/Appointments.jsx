import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import FloatingBookButton from "../components/FloatingBookButton";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  // Simulate fetching (replace with real API call later)
  useEffect(() => {
    setAppointments([
      {
        id: "A123",
        barber: "Samir",
        serviceSummary: "Haircut + Beard Trim",
        date: "2025-06-28",
        time: "16:30",
        status: "upcoming", // can be 'done', 'canceled'
      },
      {
        id: "A124",
        barber: "Karim",
        serviceSummary: "Facial",
        date: "2025-06-20",
        time: "14:00",
        status: "done",
      },
      {
        id: "A125",
        barber: "Samir",
        serviceSummary: "Haircut",
        date: "2025-06-22",
        time: "15:00",
        status: "canceled",
      },
    ]);
  }, []);

  const statusStyle = {
    upcoming: "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300",
    done: "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300",
    canceled: "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300",
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300 p-6 pt-12">
      <BottomNav />
      <FloatingBookButton />

      <h1 className="text-2xl font-bold mb-6">Your Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
          No appointments found.
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold">{a.serviceSummary}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    statusStyle[a.status]
                  }`}
                >
                  {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                </span>
              </div>
              <p className="text-sm">
                {new Date(a.date).toDateString()} • {a.time}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Barber: {a.barber}
              </p>

              {/* Cancel button logic shown only if upcoming and >2h logic comes later */}
              {a.status === "upcoming" && (
                <button
                  onClick={() => alert("Ask reason, then cancel")}
                  className="mt-3 text-sm text-red-500 underline hover:text-red-600"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
