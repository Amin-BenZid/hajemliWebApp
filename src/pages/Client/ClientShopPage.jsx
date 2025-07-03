import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { MapPin, Phone, Clock, XCircle, CalendarDays, User } from "lucide-react";
import FloatingBookButton from "../../components/FloatingBookButton";

export default function ClientShopPage() {
  const client = JSON.parse(localStorage.getItem("client"));
  const [shop, setShop] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchShopAndAppointments = async () => {
      try {
        const shopRes = await fetch(`/api/shops/${client.shop_id}`);
        const shopData = await shopRes.json();
        setShop(shopData);

        const appointmentsRes = await fetch(
          `/api/appointments/client/${client.client_id}`
        );
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    if (client?.shop_id) fetchShopAndAppointments();
  }, [client]);

  const cancelAppointment = async (appointmentId) => {
    const reason = prompt("Please enter a reason for cancellation:");
    await fetch(`/api/appointments/${appointmentId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a._id === appointmentId ? { ...a, state: "canceled" } : a))
    );
  };

  const isCancellable = (time) => {
    const now = new Date();
    const appointmentTime = new Date(time);
    return appointmentTime - now > 2 * 60 * 60 * 1000;
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300 p-4">
      <BottomNav />
      <FloatingBookButton />

      <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Your Barber Shop</h1>

      {shop ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {shop.shop_name}
          </h2>
          <p className="text-gray-600 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <MapPin size={16} /> <strong>Location:</strong> {shop.localisation}
          </p>
          <p className="text-gray-600 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <Phone size={16} /> <strong>Contact:</strong> {shop.number}
          </p>
          <p className="text-gray-600 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <Clock size={16} /> <strong>Hours:</strong> {shop.work_hours}
          </p>
          <p className="text-gray-600 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <XCircle size={16} /> <strong>Day Off:</strong> {shop.day_off}
          </p>
          <button
            onClick={() => (window.location.href = `/shop/${shop._id}`)}
            className="mt-4 bg-black text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90"
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <p className="text-gray-500 italic">Loading shop info...</p>
      )}

      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <CalendarDays size={20} /> Your Appointments
      </h2>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 italic">No appointments found.</p>
        ) : (
          appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="flex items-center gap-1">
                  <User size={16} /> <strong>Barber:</strong> {a.barber_name || "—"}
                </p>
                <p className="flex items-center gap-1">
                  <CalendarDays size={16} /> <strong>Date:</strong>{" "}
                  {new Date(a.time_and_date).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> <span className="capitalize">{a.state}</span>
                </p>
              </div>
              {a.state === "pending" && isCancellable(a.time_and_date) && (
                <button
                  onClick={() => cancelAppointment(a._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
