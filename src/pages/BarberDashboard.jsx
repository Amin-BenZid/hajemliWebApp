import { useState } from "react";
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
import BarberBottomNav from "../components/BarberBottomNav";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function BarberDashboard() {
  const [stats] = useState({
    income: 850,
    upcomingAppointments: 5,
    avgRating: 4.6,
    weeklyIncome: [
      { day: "Mon", income: 100 },
      { day: "Tue", income: 150 },
      { day: "Wed", income: 200 },
      { day: "Thu", income: 100 },
      { day: "Fri", income: 300 },
    ],
    topServices: [
      { name: "Haircut", value: 12 },
      { name: "Beard Trim", value: 8 },
      { name: "Facial", value: 4 },
    ],
    recentAppointments: [
      {
        id: "a1",
        client: "Ali Ben Salah",
        date: "2025-06-25",
        time: "15:00",
        services: ["Haircut"],
      },
      {
        id: "a2",
        client: "Moez Zid",
        date: "2025-06-24",
        time: "12:00",
        services: ["Haircut", "Beard Trim"],
      },
      {
        id: "a3",
        client: "Sara Ghribi",
        date: "2025-06-23",
        time: "10:30",
        services: ["Facial"],
      },
    ],
  });

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
            value={`${stats.income} DT`}
          />
          <StatCard
            icon={<CalendarDays />}
            label="Upcoming"
            value={`${stats.upcomingAppointments} Appointments`}
          />
          <StatCard icon={<Star />} label="Avg. Rating" value={`${stats.avgRating} ★`} />
        </div>
      </a>
      {/* Advanced Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue per Service */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">💰 Revenue Per Service</h2>
          <ul className="text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              Haircut: 12 x 30DT = <span className="font-semibold">360DT</span>
            </li>
            <li>
              Beard Trim: 8 x 20DT = <span className="font-semibold">160DT</span>
            </li>
            <li>
              Facial: 4 x 25DT = <span className="font-semibold">100DT</span>
            </li>
          </ul>
        </div>

        {/* Average Service Duration */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">⏱ Average Service Duration</h2>
          <ul className="text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>Haircut: 30 mins</li>
            <li>Beard Trim: 15 mins</li>
            <li>Facial: 20 mins</li>
            <li className="font-medium text-indigo-500 mt-2">
              Overall Avg: <span className="text-black dark:text-white">21.6 mins</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">📈 Weekly Income</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyIncome}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">🏆 Top Services</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.topServices}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {stats.topServices.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Appointments</h2>
        <div className="space-y-3">
          {stats.recentAppointments.map((a) => (
            <Link
              to="/barber/appointments"
              key={a.id}
              className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded-xl block hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
            >
              <p className="text-sm font-semibold flex items-center gap-1">
                <User size={14} />
                {a.client}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                <CalendarDays size={14} className="inline-block mr-1" />
                {a.date} – {a.time}
              </p>
              <p className="text-sm">Services: {a.services.join(", ")}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Insights & Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
            <TrendingUp size={16} /> Productivity Insights
          </h2>
          <ul className="text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>📅 Busy day: Friday (most appointments)</li>
            <li>⭐ Your most reviewed service: Haircut</li>
            <li>🧠 Suggestion: Offer a combo pack at 10% off</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/barber-profile"
              className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-4 py-3 text-center text-sm"
            >
              View Profile
            </Link>
            <Link
              to="/barber-jobs"
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
