import { useState, useEffect } from "react";
import BottomNav from "../../components/BottomNav";
import FloatingBookButton from "../../components/FloatingBookButton";
import { useAuth } from "../../context/AuthContext";
import { fetchClientAppointments } from "../../services/api";
import { fetchBarberById } from "../../services/api";
import { fetchServiceById } from "../../services/api";
import { fetchShopById } from "../../services/api";
import { updateAppointmentState } from "../../services/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth();
  const [barberNames, setBarberNames] = useState({});
  const [serviceNames, setServiceNames] = useState({});
  const [shopNames, setShopNames] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    async function getAppointments() {
      if (user && user.client_id) {
        try {
          const data = await fetchClientAppointments(user.client_id);
          setAppointments(data);
        } catch (err) {
          setAppointments([]);
        }
      }
    }
    getAppointments();
  }, [user]);

  useEffect(() => {
    async function fetchBarberNames() {
      const uniqueBarberIds = [...new Set(appointments.map(a => a.barber_id).filter(Boolean))];
      const newBarberNames = { ...barberNames };
      for (const barberId of uniqueBarberIds) {
        if (!newBarberNames[barberId]) {
          try {
            const barber = await fetchBarberById(barberId);
            newBarberNames[barberId] = barber.name;
          } catch {
            newBarberNames[barberId] = barberId;
          }
        }
      }
      setBarberNames(newBarberNames);
    }
    if (appointments.length > 0) {
      fetchBarberNames();
    }
    // eslint-disable-next-line
  }, [appointments]);

  useEffect(() => {
    async function fetchServiceNames() {
      const allServiceIds = appointments.flatMap(a => Array.isArray(a.service_id) ? a.service_id : [a.service_id]).filter(Boolean);
      const uniqueServiceIds = [...new Set(allServiceIds)];
      const newServiceNames = { ...serviceNames };
      for (const serviceId of uniqueServiceIds) {
        if (!newServiceNames[serviceId]) {
          try {
            const service = await fetchServiceById(serviceId);
            newServiceNames[serviceId] = service.name;
          } catch {
            newServiceNames[serviceId] = serviceId;
          }
        }
      }
      setServiceNames(newServiceNames);
    }
    if (appointments.length > 0) {
      fetchServiceNames();
    }
    // eslint-disable-next-line
  }, [appointments]);

  useEffect(() => {
    async function fetchShopNames() {
      const uniqueShopIds = [...new Set(appointments.map(a => a.shop_id).filter(Boolean))];
      const newShopNames = { ...shopNames };
      for (const shopId of uniqueShopIds) {
        if (!newShopNames[shopId]) {
          try {
            const shop = await fetchShopById(shopId);
            newShopNames[shopId] = shop.shop_name || shopId;
          } catch {
            newShopNames[shopId] = shopId;
          }
        }
      }
      setShopNames(newShopNames);
    }
    if (appointments.length > 0) {
      fetchShopNames();
    }
    // eslint-disable-next-line
  }, [appointments]);

  // Sort appointments by date descending (newest first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.time_and_date).getTime();
    const dateB = new Date(b.time_and_date).getTime();
    return dateB - dateA;
  });

  const statusStyle = {
    pending: "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300",
    confirmed: "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300",
    done: "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300",
    canceled: "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300",
    Done: "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300",
  };

  const handleCancel = (appointmentId) => {
    setCancelId(appointmentId);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (cancelId) {
      try {
        await updateAppointmentState(cancelId, "canceled");
        // Refresh appointments
        if (user && user.client_id) {
          const data = await fetchClientAppointments(user.client_id);
          setAppointments(data);
        }
      } catch (err) {
        alert("Failed to cancel appointment.");
      }
    }
    setShowCancelModal(false);
    setCancelId(null);
  };

  const closeModal = () => {
    setShowCancelModal(false);
    setCancelId(null);
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
          {sortedAppointments.map((a) => (
            <div
              key={a._id || a.appointment_id}
              className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-800 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold">
                  {Array.isArray(a.service_id)
                    ? a.service_id.map(id => serviceNames[id] || id).join(", ")
                    : (serviceNames[a.service_id] || a.service_id)}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[a.state] || ""}`}
                >
                  {a.state ? a.state.charAt(0).toUpperCase() + a.state.slice(1) : ""}
                </span>
              </div>
              <p className="text-sm">
                {a.time_and_date ? new Date(a.time_and_date).toLocaleDateString() : ""} • {a.time_and_date ? new Date(a.time_and_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Barber: {barberNames[a.barber_id] || a.barber_id}
              </p>
              {a.shop_id && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Shop: {shopNames[a.shop_id] || a.shop_id}
                </p>
              )}

              {/* Cancel button logic shown only if upcoming and >2h logic comes later */}
              {a.state === "pending" && (
                <button
                  onClick={() => handleCancel(a.appointment_id)}
                  className="mt-3 text-sm text-red-500 underline hover:text-red-600"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Cancel Appointment</h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-200">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmCancel}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Yes, Cancel
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

