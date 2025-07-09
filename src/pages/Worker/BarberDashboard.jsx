import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarDays,
  DollarSign,
  Star,
  User,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import BarberBottomNav from "../../components/BarberBottomNav";
import { fetchBarberMonthlyIncome, fetchBarberPendingAppointments, fetchBarberById, fetchBarberServiceRevenueSummary, fetchBarberServiceDurations, fetchBarberWeeklyIncome, fetchBarberPastAcceptedAppointments, fetchBarberMostPopularDay, fetchBarberMostUsedService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function BarberDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [income, setIncome] = useState(null);
  const [incomeLoading, setIncomeLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(null);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [serviceRevenue, setServiceRevenue] = useState([]);
  const [serviceRevenueLoading, setServiceRevenueLoading] = useState(true);
  const [serviceDurations, setServiceDurations] = useState([]);
  const [serviceDurationsLoading, setServiceDurationsLoading] = useState(true);
  const [showAllDurations, setShowAllDurations] = useState(false);
  const [weeklyIncome, setWeeklyIncome] = useState([]);
  const [weeklyIncomeLoading, setWeeklyIncomeLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentAppointmentsLoading, setRecentAppointmentsLoading] = useState(true);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [stats] = useState({
    // Remove recentAppointments from here
  });
  const [mostPopularDay, setMostPopularDay] = useState("");
  const [mostPopularDayLoading, setMostPopularDayLoading] = useState(true);
  const [mostUsedService, setMostUsedService] = useState("");
  const [mostUsedServiceLoading, setMostUsedServiceLoading] = useState(true);

  useEffect(() => {
    const barberId = user?.barber_id || user?._id || user?.id;
    if (barberId) {
      setIncomeLoading(true);
      setPendingLoading(true);
      setRatingLoading(true);
      setServiceRevenueLoading(true);
      setServiceDurationsLoading(true);
      setWeeklyIncomeLoading(true);
      setRecentAppointmentsLoading(true);
      setMostPopularDayLoading(true);
      setMostUsedServiceLoading(true);
      console.log("Fetching income for barber ID:", barberId);
      fetchBarberMonthlyIncome(barberId)
        .then((data) => {
          console.log("API returned income:", data);
          setIncome(data);
        })
        .catch((err) => {
          console.error("Failed to fetch income", err);
          setIncome(null);
        })
        .finally(() => setIncomeLoading(false));
      fetchBarberPendingAppointments(barberId)
        .then((data) => {
          console.log("API returned pending appointments:", data);
          setPendingCount(Array.isArray(data) ? data.length : 0);
        })
        .catch((err) => {
          console.error("Failed to fetch pending appointments", err);
          setPendingCount(null);
        })
        .finally(() => setPendingLoading(false));
      fetchBarberById(barberId)
        .then((data) => {
          console.log("API returned barber details:", data);
          setAvgRating(data.rating);
        })
        .catch((err) => {
          console.error("Failed to fetch barber details", err);
          setAvgRating(null);
        })
        .finally(() => setRatingLoading(false));
      fetchBarberServiceRevenueSummary(barberId)
        .then((data) => {
          console.log("API returned service revenue summary:", data);
          setServiceRevenue(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Failed to fetch service revenue summary", err);
          setServiceRevenue([]);
        })
        .finally(() => setServiceRevenueLoading(false));
      fetchBarberServiceDurations(barberId)
        .then((data) => {
          console.log("API returned service durations:", data);
          setServiceDurations(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Failed to fetch service durations", err);
          setServiceDurations([]);
        })
        .finally(() => setServiceDurationsLoading(false));
      fetchBarberWeeklyIncome(barberId)
        .then((data) => {
          console.log("API returned weekly income:", data);
          setWeeklyIncome(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Failed to fetch weekly income", err);
          setWeeklyIncome([]);
        })
        .finally(() => setWeeklyIncomeLoading(false));
      fetchBarberPastAcceptedAppointments(barberId)
        .then((data) => {
          console.log("API returned recent appointments:", data);
          setRecentAppointments(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Failed to fetch recent appointments", err);
          setRecentAppointments([]);
        })
        .finally(() => setRecentAppointmentsLoading(false));
      fetchBarberMostPopularDay(barberId)
        .then((data) => {
          console.log("API returned most popular day:", data);
          setMostPopularDay(Array.isArray(data) && data.length > 0 ? data[0] : "");
        })
        .catch((err) => {
          console.error("Failed to fetch most popular day", err);
          setMostPopularDay("");
        })
        .finally(() => setMostPopularDayLoading(false));
      fetchBarberMostUsedService(barberId)
        .then((data) => {
          console.log("API returned most used service:", data);
          setMostUsedService(Array.isArray(data) && data.length > 0 ? data[0] : "");
        })
        .catch((err) => {
          console.error("Failed to fetch most used service", err);
          setMostUsedService("");
        })
        .finally(() => setMostUsedServiceLoading(false));
    }
  }, [user]);

  // Parse top services for PieChart
  const topServices = serviceRevenue
    .map((line) => {
      // Match patterns like 'ServiceName : 11 x 69DT = 759DT' or 'ServiceName: 7 x 5DT = 35DT'
      const match = line.match(/^(.*?)[ :]\s*(\d+)\s*x/);
      if (match) {
        return { name: match[1].trim(), value: parseInt(match[2], 10) };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="pb-20 pt-10 min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold pb-4">My Dashboard</h1>
      <BarberBottomNav />
      {/* Summary Cards */}
      <a href="/barber/appointments">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            icon={<DollarSign />}
            label="Monthly Income"
            value={incomeLoading ? "Loading..." : income !== null ? `${income} DT` : "N/A"}
          />
          <StatCard
            icon={<CalendarDays />}
            label="Upcoming"
            value={pendingLoading ? "Loading..." : pendingCount !== null ? `${pendingCount} Appointments` : "N/A"}
          />
          <StatCard icon={<Star />} label="Avg. Rating" value={ratingLoading ? "Loading..." : avgRating !== null ? `${avgRating} ★` : "N/A"} />
        </div>
      </a>
      {/* Advanced Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue per Service */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">💰 Revenue Per Service</h2>
          <ul className="text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
            {serviceRevenueLoading ? (
              <li>Loading...</li>
            ) : serviceRevenue.length > 0 ? (
              serviceRevenue.map((line, idx) => <li key={idx}>{line}</li>)
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>

        {/* Average Service Duration */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">⏱ Average Service Duration</h2>
          <ul className="text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
            {serviceDurationsLoading ? (
              <li>Loading...</li>
            ) : serviceDurations.length > 0 ? (
              (() => {
                // Separate overall avg and service lines
                const serviceLines = serviceDurations.filter(line => !line.startsWith("Overall Avg:"));
                const overallAvgLine = serviceDurations.find(line => line.startsWith("Overall Avg:"));
                const linesToShow = showAllDurations ? serviceLines : serviceLines.slice(0, 1);
                return <>
                  {linesToShow.map((line, idx) => (
                    <li key={idx}>{line} <span className="text-xs text-zinc-500">mins</span></li>
                  ))}
                  {serviceLines.length > 1 && (
                    <button
                      className="text-indigo-500 text-xs font-medium mt-1 focus:outline-none"
                      onClick={() => setShowAllDurations(v => !v)}
                    >
                      {showAllDurations ? "Show Less" : "Show More"}
                    </button>
                  )}
                  {overallAvgLine && (
                    <li className="font-medium text-indigo-500 mt-2">
                      Overall Avg: <span className="text-black dark:text-white font-bold">{overallAvgLine.split(":")[1]?.trim()}</span>
                    </li>
                  )}
                </>;
              })()
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">📈 Weekly Income</h2>
          <ResponsiveContainer width="100%" height={200}>
            {weeklyIncomeLoading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
              <BarChart data={weeklyIncome}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">🏆 Top Services</h2>
          <ResponsiveContainer width="100%" height={200}>
            {serviceRevenueLoading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : topServices.length > 0 ? (
              <PieChart>
                <Pie
                  data={topServices}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {topServices.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full">No data available</div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Appointments</h2>
        <div className="space-y-3">
          {recentAppointmentsLoading ? (
            <div>Loading...</div>
          ) : recentAppointments.length > 0 ? (
            (() => {
              const toShow = showAllAppointments ? recentAppointments : recentAppointments.slice(0, 3);
              return <>
                {toShow.map((a, idx) => {
                  // Split date and time if needed
                  let date = a.date;
                  let time = "";
                  if (date && date.includes("–")) {
                    const parts = date.split("–");
                    date = parts[0].trim();
                    time = parts[1].trim();
                  }
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl block hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                    >
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <User size={14} />
                        {a.clientName || "Unknown"}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        <CalendarDays size={14} className="inline-block mr-1" />
                        {date}{time ? ` – ${time}` : ""}
                      </p>
                      <p className="text-sm">Services: {a.services?.join(", ")}</p>
                    </div>
                  );
                })}
                {recentAppointments.length > 3 && (
                  <button
                    className="text-indigo-500 text-xs font-medium mt-1 focus:outline-none"
                    onClick={() => setShowAllAppointments(v => !v)}
                  >
                    {showAllAppointments ? "Show Less" : "Show More"}
                  </button>
                )}
              </>;
            })()
          ) : (
            <div>No recent appointments</div>
          )}
        </div>
      </div>

      {/* Insights & Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
            <TrendingUp size={16} /> Productivity Insights
          </h2>
          <ul className="text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>📅 Busy day: {mostPopularDayLoading ? "Loading..." : mostPopularDay || "N/A"} (most appointments)</li>
            <li>⭐ Your most reviewed service: {mostUsedServiceLoading ? "Loading..." : mostUsedService || "N/A"}</li>
            {/* <li>🧠 Suggestion: Offer a combo pack at 10% off</li> */}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/barber/profile"
              className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-4 py-3 text-center text-sm"
            >
              View Profile
            </Link>
            <Link
              to="/barber/jobs"
              className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-4 py-3 text-center text-sm flex items-center justify-center gap-1"
            >
              <Briefcase size={14} />
              Find Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small card component
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl shadow flex items-center gap-3">
      <div className="text-indigo-500">{icon}</div>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
