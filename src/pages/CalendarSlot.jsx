import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarDays, Clock4, ClipboardList } from "lucide-react";

export default function CalendarSlot() {
  const location = useLocation();
  const navigate = useNavigate();
  const services = location.state?.services || [];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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

  return (
    <div className="min-h-screen px-6 py-8 bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300 max-w-2xl mx-auto">
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
          onChange={setSelectedDate}
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
        <div>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
            <Clock4 size={18} />
            Pick a Time
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((slot, idx) => (
              <button
                key={idx}
                disabled={slot.disabled}
                onClick={() => setSelectedTime(slot.time)}
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
        <button
          onClick={handleConfirm}
          className="w-full mt-6 py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90 transition"
        >
          Confirm Booking
        </button>
      )}
    </div>
  );
}
