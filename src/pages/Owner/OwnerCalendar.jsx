import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchShopByOwnerId, fetchShopDetailedAppointments, updateAppointmentState } from "../../services/api";
import {
  CalendarDays,
  User,
  Clock,
  Scissors,
  Check,
  XCircle,
  Loader,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";

export default function OwnerCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBarber, setSelectedBarber] = useState("All");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const { user } = useAuth();
  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      try {
        const shop = await fetchShopByOwnerId(user.owner_id || user._id);
        const data = await fetchShopDetailedAppointments(shop.shop_id);
        setAppointments(data);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }
    if (user) loadAppointments();
  }, [user]);

  // Dynamically generate barber list from appointments, using barber_id and barber name
  const { owner_id } = user || {};
  const barberMap = new Map();
  let meBarber = null;
  appointments.forEach((appt) => {
    if (appt.barber_id && appt.barber) {
      if (appt.barber_id === owner_id) {
        meBarber = { id: owner_id, name: "Me" };
      } else {
        barberMap.set(appt.barber_id, appt.barber);
      }
    }
  });
  const barberList = [
    { id: "All", name: "All" },
    ...(meBarber ? [meBarber] : []),
    ...Array.from(barberMap.entries()).map(([id, name]) => ({ id, name })),
  ];

  const filtered = appointments.filter((appt) => {
    const matchDate = appt.date === selectedDate;
    const matchStatus = statusFilter === "all" || appt.status === statusFilter;
    const matchBarber = selectedBarber === "All" || appt.barber_id === selectedBarber;
    return matchDate && matchStatus && matchBarber;
  });

  const statusIcon = {
    accepted: <Check className="text-green-500" />,
    pending: <Loader className="text-yellow-500 animate-spin" />,
    canceled: <XCircle className="text-red-500" />,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 dark:text-white pb-32 px-4  pt-6 space-y-6">
      <OwnerBottomNav />
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarDays className="w-6 h-6" />
        Appointments
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-md px-3 py-1.5 border dark:bg-zinc-800 dark:border-zinc-600"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md px-3 py-1.5 border dark:bg-zinc-800 dark:border-zinc-600"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="canceled">Canceled</option>
        </select>

        <select
          value={selectedBarber}
          onChange={(e) => setSelectedBarber(e.target.value)}
          className="rounded-md px-3 py-1.5 border dark:bg-zinc-800 dark:border-zinc-600"
        >
          {barberList.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </div>

      {/* Appointments */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          No appointments found.
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((appt) => (
            <div
              key={appt.id}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 space-y-2 border dark:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {appt.date} at {appt.time}
                </div>
                {statusIcon[appt.status]}
              </div>
              <div className="text-lg font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                {appt.client}
              </div>
              <div className="text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                {appt.service}
              </div>
              <div className="text-sm flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Clock className="w-4 h-4" />
                Barber: {appt.barber_id === owner_id ? "Me" : appt.barber}
              </div>
              {/* Show Accept/Cancel for pending appointments of Me */}
              {appt.status === "pending" && appt.barber_id === owner_id && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 rounded bg-green-500 text-white text-sm flex items-center gap-1"
                    onClick={async () => {
                      try {
                        await updateAppointmentState(appt.appointment_id, "accepted");
                        setAppointments((prev) => prev.map(a => a.id === appt.id ? { ...a, status: "accepted" } : a));
                      } catch {}
                    }}
                  >
                    <ThumbsUp className="w-4 h-4" /> Accept
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-500 text-white text-sm flex items-center gap-1"
                    onClick={async () => {
                      try {
                        await updateAppointmentState(appt.appointment_id, "canceled");
                        setAppointments((prev) => prev.map(a => a.id === appt.id ? { ...a, status: "canceled" } : a));
                      } catch {}
                    }}
                  >
                    <ThumbsDown className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
