import { useState } from "react";
import {
  Bell,
  Star,
  Briefcase,
  CalendarCheck,
  Store,
  XCircle,
  ArrowRight,
} from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";

export default function BarberNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      type: "job",
      title: "New Job Offer from Luxury Barber Shop",
      message: "They want to hire you as a senior barber.",
      date: "2025-06-29T10:45:00",
      shopId: "TUNX45",
    },
    {
      id: "n2",
      type: "appointment",
      title: "New Appointment Booked",
      message: "Client Amine BZ booked a haircut at 14:00.",
      date: "2025-06-29T08:00:00",
    },
    {
      id: "n3",
      type: "review",
      title: "New Review Received",
      message: "You got a 5-star review from Lina Z.",
      date: "2025-06-28T21:00:00",
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "job":
        return <Briefcase size={20} className="text-blue-500" />;
      case "appointment":
        return <CalendarCheck size={20} className="text-green-500" />;
      case "review":
        return <Star size={20} className="text-yellow-500" />;
      case "shop":
        return <Store size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} />;
    }
  };

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white px-6 pt-10 pb-24">
      <BarberBottomNav />
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell size={24} /> Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-sm text-center text-zinc-500 mt-10">
          No notifications right now.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white dark:bg-zinc-800 p-4 rounded-xl border dark:border-zinc-700 shadow flex items-start justify-between gap-4"
            >
              <div className="flex gap-3">
                <div>{getIcon(n.type)}</div>
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{n.message}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(n.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {n.type === "job" && (
                  <a
                    href={`/shop/${n.shopId}`}
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    View Offer <ArrowRight size={14} className="ml-1" />
                  </a>
                )}
                <button
                  onClick={() => handleDismiss(n.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  <XCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
