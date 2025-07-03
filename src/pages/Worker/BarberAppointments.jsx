import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  User,
  Filter,
  RefreshCcw,
  Info,
} from "lucide-react";
import BarberBottomNav from "../../components/BarberBottomNav";

export default function BarberAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  //   const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    setAppointments([
      {
        _id: "a1",
        client_name: "Amine BZ",
        time_and_date: "2025-07-01T14:00:00",
        services: ["Haircut", "Beard Trim"],
        state: "pending",
        phone: "+216 50 123 456",
        notes: "Client prefers fade haircut.",
      },
      {
        _id: "a2",
        client_name: "Sarra M.",
        time_and_date: "2025-06-25T11:30:00",
        services: ["Shave"],
        state: "done",
        phone: "+216 20 456 789",
        notes: "Requested aloe vera treatment.",
      },
      {
        _id: "a3",
        client_name: "Omar K.",
        time_and_date: "2025-06-27T16:00:00",
        services: ["Haircut", "Facial"],
        state: "canceled",
        phone: "+216 98 456 123",
        notes: "Canceled due to emergency.",
      },
    ]);
  }, []);

  const updateStatus = (id, newState) => {
    const confirmAction = window.confirm(`Mark as "${newState}"?`);
    if (!confirmAction) return;
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, state: newState } : a))
    );
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setDateFilter("");
    setSortOrder("newest");
  };

  const getStatusColor = (state) => {
    switch (state) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200";
      case "done":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200";
      case "canceled":
        return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200";
      default:
        return "";
    }
  };

  const filteredAppointments = appointments
    .filter((a) => {
      const matchStatus = statusFilter === "all" || a.state === statusFilter;
      const matchDate =
        !dateFilter ||
        new Date(a.time_and_date).toISOString().slice(0, 10) === dateFilter;
      return matchStatus && matchDate;
    })
    .sort((a, b) => {
      const t1 = new Date(a.time_and_date).getTime();
      const t2 = new Date(b.time_and_date).getTime();
      return sortOrder === "newest" ? t2 - t1 : t1 - t2;
    });

  return (
    <div className=" pb-20 min-h-screen px-6 py-10 bg-white dark:bg-zinc-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <Filter size={20} />
        Manage Appointments
      </h1>

      <BarberBottomNav />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-3xl mx-auto items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-sm"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 px-4 py-2 border text-sm rounded-xl text-zinc-700 dark:text-white dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          <RefreshCcw size={16} />
          Clear
        </button>
      </div>
      {/* {!isAvailable && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm px-4 py-3 rounded-xl mb-4">
          You are currently marked as <strong>Not Available</strong>. Clients cannot book
          new appointments.
        </div>
      )} */}

      {/* Appointment Cards */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredAppointments.map((a) => (
          <div
            key={a._id}
            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow border dark:border-zinc-700 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <p className="flex items-center gap-2 font-semibold">
                <User size={18} />
                {a.client_name}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  a.state
                )}`}
              >
                {a.state}
              </span>
            </div>

            <p className="flex items-center gap-2 text-sm">
              <CalendarDays size={16} />
              {new Date(a.time_and_date).toLocaleDateString()} – <Clock size={16} />
              {new Date(a.time_and_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Scissors size={16} />
              {a.services.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full text-xs"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex gap-4 mt-2 flex-wrap">
              {a.state === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(a._id, "done")}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-xl"
                  >
                    <CheckCircle2 size={16} />
                    Done
                  </button>
                  <button
                    onClick={() => updateStatus(a._id, "canceled")}
                    className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-xl"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(a)}
                className="flex items-center gap-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-xl"
              >
                <Info size={16} />
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold">Appointment Details</h2>
            <p className="text-sm">
              <strong>Client:</strong> {selectedAppointment.client_name}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {selectedAppointment.phone}
            </p>
            <p className="text-sm">
              <strong>Time:</strong>{" "}
              {new Date(selectedAppointment.time_and_date).toLocaleString()}
            </p>
            <p className="text-sm">
              <strong>Services:</strong> {selectedAppointment.services.join(", ")}
            </p>
            {selectedAppointment.notes && (
              <p className="text-sm">
                <strong>Notes:</strong> {selectedAppointment.notes}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl text-sm bg-zinc-100 dark:bg-zinc-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
