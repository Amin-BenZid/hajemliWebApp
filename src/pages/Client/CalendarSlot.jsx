import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarDays, Clock4, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export default function CalendarSlot() {
  const location = useLocation();
  const navigate = useNavigate();
  const services = location.state?.services || [];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeRef = useRef(null);
  const confirmRef = useRef(null);

  const shop = {
    work_hours: "09:00 AM - 05:00 PM",
    day_off: ["Sunday"],
    fullDates: ["2025-06-30"],
  };

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
    if (!selectedDate) return [];
    const [openTime, closeTime] = shop.work_hours.split(" - ");
    const start = parseTime(openTime);
    const end = parseTime(closeTime);
    const step = 30;
    const duration = getServiceTotalDuration(services);
    const fakeBooked = ["10:00 AM", "01:00 PM"];
    const slots = [];
    for (let t = start; t + duration <= end; t += step) {
      const label = formatTime(t);
      const isBooked = fakeBooked.includes(label);
      slots.push({ time: label, disabled: isBooked });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleConfirm = () => {
    navigate("/confirmation", {
      state: {
        date: selectedDate?.toDateString(),
        time: selectedTime,
        services: services,
      },
    });
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
            return shop.day_off.includes(day);
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
          <button
            onClick={handleConfirm}
            className="w-full mt-6 py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90 transition"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </motion.div>
  );
}
