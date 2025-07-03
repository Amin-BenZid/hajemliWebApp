import { useState, useEffect } from "react";
import {
  CalendarDays,
  User,
  Clock,
  Scissors,
  Check,
  XCircle,
  Loader,
} from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";

const mockAppointments = [
  {
    id: 1,
    client: "Ahmed M.",
    barber: "Ali",
    service: "Skin Fade",
    date: "2025-07-03",
    time: "10:00",
    status: "done",
  },
  {
    id: 2,
    client: "Sara B.",
    barber: "Sami",
    service: "Beard Trim",
    date: "2025-07-03",
    time: "11:30",
    status: "pending",
  },
  {
    id: 3,
    client: "Omar Z.",
    barber: "Hamza",
    service: "Hair Color",
    date: "2025-07-03",
    time: "13:00",
    status: "canceled",
  },
  {
    id: 4,
    client: "Linda F.",
    barber: "Ali",
    service: "Kids Cut",
    date: "2025-07-04",
    time: "09:00",
    status: "pending",
  },
  {
    id: 5,
    client: "Rami T.",
    barber: "Sami",
    service: "Skin Fade",
    date: "2025-07-04",
    time: "10:30",
    status: "done",
  },
  {
    id: 6,
    client: "Yasmine K.",
    barber: "Hamza",
    service: "Beard Trim",
    date: "2025-07-04",
    time: "12:00",
    status: "done",
  },
  {
    id: 7,
    client: "Tariq A.",
    barber: "Ali",
    service: "Hair Color",
    date: "2025-07-05",
    time: "14:00",
    status: "canceled",
  },
  {
    id: 8,
    client: "Fatma G.",
    barber: "Sami",
    service: "Kids Cut",
    date: "2025-07-05",
    time: "15:30",
    status: "done",
  },
  {
    id: 9,
    client: "Khaled L.",
    barber: "Hamza",
    service: "Skin Fade",
    date: "2025-07-05",
    time: "17:00",
    status: "pending",
  },
];

const barbers = ["All", "Ali", "Sami", "Hamza"];

export default function OwnerCalendar() {
  const [selectedDate, setSelectedDate] = useState("2025-07-03");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBarber, setSelectedBarber] = useState("All");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const filtered = appointments.filter((appt) => {
    const matchDate = appt.date === selectedDate;
    const matchStatus = statusFilter === "all" || appt.status === statusFilter;
    const matchBarber = selectedBarber === "All" || appt.barber === selectedBarber;
    return matchDate && matchStatus && matchBarber;
  });

  const statusIcon = {
    done: <Check className="text-green-500" />,
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
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>

        <select
          value={selectedBarber}
          onChange={(e) => setSelectedBarber(e.target.value)}
          className="rounded-md px-3 py-1.5 border dark:bg-zinc-800 dark:border-zinc-600"
        >
          {barbers.map((barber) => (
            <option key={barber} value={barber}>
              {barber}
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
                Barber: {appt.barber}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
