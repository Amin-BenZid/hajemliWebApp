import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarDays, Clock4, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { fetchBarberDaysOff, fetchBarberWorkHours, fetchBarberBookedTimes, createAppointment } from "../../services/api";

export default function CalendarSlot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { barberId } = useParams();
  const services = location.state?.services || [];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [daysOff, setDaysOff] = useState([]);
  const [loadingDaysOff, setLoadingDaysOff] = useState(true);
  const [daysOffError, setDaysOffError] = useState(null);
  const [workHours, setWorkHours] = useState("");
  const [loadingWorkHours, setLoadingWorkHours] = useState(true);
  const [workHoursError, setWorkHoursError] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingBookedTimes, setLoadingBookedTimes] = useState(true);
  const [bookedTimesError, setBookedTimesError] = useState(null);

  const timeRef = useRef(null);
  const confirmRef = useRef(null);

  const shop = {
    work_hours: workHours,
    // day_off: ["Sunday","Saturday"], // removed, now dynamic
    fullDates: ["2025-06-30"],
  };

  // Fetch days off from API
  useEffect(() => {
    async function fetchDaysOff() {
      setLoadingDaysOff(true);
      setDaysOffError(null);
      try {
        const days = await fetchBarberDaysOff(barberId);
        setDaysOff(days);
      } catch (err) {
        setDaysOffError("Failed to load days off.");
        setDaysOff([]);
      } finally {
        setLoadingDaysOff(false);
      }
    }
    fetchDaysOff();
  }, [barberId]);

  // Fetch work hours from API
  useEffect(() => {
    async function fetchWorkHours() {
      setLoadingWorkHours(true);
      setWorkHoursError(null);
      try {
        const hours = await fetchBarberWorkHours(barberId);
        setWorkHours(hours);
      } catch (err) {
        setWorkHoursError("Failed to load work hours.");
        setWorkHours("");
      } finally {
        setLoadingWorkHours(false);
      }
    }
    fetchWorkHours();
  }, [barberId]);

  // Fetch booked times from API
  useEffect(() => {
    async function fetchBooked() {
      setLoadingBookedTimes(true);
      setBookedTimesError(null);
      try {
        const times = await fetchBarberBookedTimes(barberId);
        setBookedTimes(times);
      } catch (err) {
        setBookedTimesError("Failed to load booked times.");
        setBookedTimes([]);
      } finally {
        setLoadingBookedTimes(false);
      }
    }
    fetchBooked();
  }, [barberId]);

  const getServiceTotalDuration = (services) => {
    return services.reduce((sum, s) => {
      const match = s.time.match(/\d+/);
      const unit = s.time.toLowerCase();
      const value = match ? parseInt(match[0]) : 0;
      if (unit.includes("hour")) return sum + value * 60;
      return sum + value;
    }, 0);
  };

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = ((hours + 11) % 12) + 1;
    return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const generateTimeSlots = () => {
    if (!selectedDate || !shop.work_hours) return [];
    const [openTime, closeTime] = shop.work_hours.split(" - ");
    const start = parseTime(openTime);
    const end = parseTime(closeTime);
    const step = 30;
    const duration = getServiceTotalDuration(services);
    const slots = [];
    // Filter booked times for the selected date
    // Use local date string for comparison
    const selectedDateStr = selectedDate.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local time
    const bookedTimesForDay = bookedTimes
      .map(dtStr => {
        const dt = new Date(dtStr);
        // Log raw and local time
        console.log("Raw booked time:", dtStr, "Local:", dt.toLocaleTimeString(), "UTC:", dt.toUTCString());
        return dt;
      })
      .filter(dt => dt.toLocaleDateString('en-CA') === selectedDateStr)
      .map(dt => {
        // Use local hours/minutes for comparison, but reduce by 1 hour (60 minutes)
        let minutes = dt.getHours() * 60 + dt.getMinutes();
        minutes = minutes - 60;
        const formatted = formatTime(minutes);
        console.log("Booked time for day (local -1h):", dt.toString(), "->", minutes, formatted);
        return minutes;
      });
    console.log("Selected date (local):", selectedDateStr);
    for (let t = start; t + duration <= end; t += step) {
      const label = formatTime(t);
      // Block only the slot that matches a booked time exactly
      const isBooked = bookedTimesForDay.includes(t);
      console.log("Slot:", t, label, "isBooked:", isBooked);
      slots.push({ time: label, disabled: isBooked });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleConfirm = async () => {
    const client = JSON.parse(localStorage.getItem("user"));
    if (!client || !selectedDate || !selectedTime) return;
    // Find shop_id from client object
    const shop_id = client.shop_id;
    // Compose time_and_date as ISO string
    const [time, period] = selectedTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes, 0, 0);
    // Prepare payload
    const payload = {
      client_id: client.client_id,
      barber_id: barberId,
      shop_id: shop_id,
      service_id: services.map(s => s.service_id),
      time_and_date: appointmentDate.toISOString(),
    };
    try {
      await createAppointment(payload);
      navigate("/confirmation", {
        state: {
          date: selectedDate?.toDateString(),
          time: selectedTime,
          services: services,
        },
      });
    } catch (err) {
      alert("Failed to book appointment. Please try again.");
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setTimeout(() => {
      timeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeout(() => {
      confirmRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  // Helper to check if selected date and time is in the past
  const isPastDateTime = (() => {
    if (!selectedDate || !selectedTime) return false;
    const [time, period] = selectedTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const selected = new Date(selectedDate);
    selected.setHours(hours, minutes, 0, 0);
    return selected < new Date();
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen px-6 py-8 bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300 max-w-2xl mx-auto"
    >
      {/* Stepper Progress */}
      <div className="flex justify-between items-center mb-8 px-2">
        {[
          { label: "Service", step: 1 },
          { label: "Time", step: 2 },
          { label: "Confirm", step: 3 },
        ].map((item, i) => (
          <div key={i} className="flex-1 relative text-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 border-2 ${
                  item.step === 2
                    ? "bg-green-500 text-white border-green-500"
                    : item.step < 2
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
                  item.step < 2
                    ? "bg-green-600"
                    : item.step === 2
                    ? "bg-black"
                    : "bg-gray-300 dark:bg-zinc-600"
                }`}
                style={{ transform: "translateX(50%)" }}
              />
            )}
          </div>
        ))}
      </div>

      {loadingDaysOff ? (
        <div className="text-center text-gray-500 py-4">Loading days off...</div>
      ) : daysOffError ? (
        <div className="text-center text-red-500 py-4">{daysOffError}</div>
      ) : null}

      <button
        onClick={() => {
          const confirmCancel = window.confirm("Cancel this reservation?");
          if (confirmCancel) navigate("/discover");
        }}
        className="pb-4 text-sm font-medium text-red-500 hover:text-red-600"
      >
        Cancel
      </button>

      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
        <CalendarDays size={20} />
        Select Date & Time
      </h1>
      {/* Work Hours Display */}
      {loadingWorkHours ? (
        <div className="text-center text-gray-500 py-2">Loading work hours...</div>
      ) : workHoursError ? (
        <div className="text-center text-red-500 py-2">{workHoursError}</div>
      ) : workHours ? (
        <div className="text-center text-sm text-zinc-600 dark:text-zinc-300 mb-2">Working hours: {workHours}</div>
      ) : null}

      {/* Service Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <ClipboardList size={18} />
          Selected Services:
        </h2>
        {services.length === 0 ? (
          <p className="text-sm text-zinc-400">No services selected.</p>
        ) : (
          <ul className="list-disc pl-6 text-sm text-zinc-700 dark:text-zinc-200 space-y-1">
            {services.map((s) => (
              <li key={s.id}>
                {s.name} – {s.price} DT – {s.time}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Calendar */}
      <div className="calendar-wrapper bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
          <CalendarDays size={18} />
          Pick a Date
        </h2>
        <Calendar
          onChange={handleDateSelect}
          value={selectedDate}
          tileDisabled={({ date }) => {
            const day = date.toLocaleDateString("en-US", { weekday: "long" });
            return daysOff.includes(day);
          }}
          tileClassName={({ date }) => {
            const dayStr = date.toISOString().split("T")[0];
            if (shop.fullDates.includes(dayStr))
              return "bg-gray-300 text-gray-600 line-through";
            if (selectedDate && date.toDateString() === selectedDate.toDateString())
              return "bg-blue-600 text-white";
            return "";
          }}
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div ref={timeRef}>
          {loadingBookedTimes ? (
            <div className="text-center text-gray-500 py-2">Loading booked times...</div>
          ) : bookedTimesError ? (
            <div className="text-center text-red-500 py-2">{bookedTimesError}</div>
          ) : null}
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
            <Clock4 size={18} />
            Pick a Time
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((slot, idx) => (
              <button
                key={idx}
                disabled={slot.disabled}
                onClick={() => handleTimeSelect(slot.time)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors duration-200 ${
                  slot.disabled
                    ? "bg-gray-200 dark:bg-zinc-700 text-gray-400 cursor-not-allowed"
                    : selectedTime === slot.time
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-zinc-800 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {selectedTime && (
        <div ref={confirmRef}>
          {isPastDateTime && (
            <div className="w-full mt-4 mb-2 text-center text-red-500 font-medium">
              You cannot book an appointment in the past. Please select a future date and time.
            </div>
          )}
          <button
            onClick={isPastDateTime ? undefined : handleConfirm}
            disabled={isPastDateTime}
            className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
              isPastDateTime
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:opacity-90"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </motion.div>
  );
}
