// pages/OwnerDashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  DollarSign,
  Users,
  Scissors,
  Image,
  Pencil,
  BarChart2,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Dialog } from "@headlessui/react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";

// Fake Stats
const dashboardStats = {
  appointmentsToday: 8,
  incomeThisMonth: 3450,
  barbers: 4,
  topService: "Skin Fade",
};

const incomeTrendMonth = [
  { day: "Week 1", value: 1800 },
  { day: "Week 2", value: 2300 },
  { day: "Week 3", value: 2150 },
  { day: "Week 4", value: 3000 },
];

const barberPerformance = [
  { name: "Ali", appointments: 22, income: 1200, active: true },
  { name: "Yassine", appointments: 18, income: 1050, active: false },
  { name: "Sami", appointments: 13, income: 850, active: true },
  { name: "Hamza", appointments: 7, income: 500, active: false },
];

const topServices = [
  { name: "Skin Fade", count: 40 },
  { name: "Beard Trim", count: 28 },
  { name: "Classic Cut", count: 23 },
  { name: "Kids Cut", count: 10 },
];

const satisfactionData = [
  { name: "Very Satisfied", value: 65 },
  { name: "Satisfied", value: 25 },
  { name: "Unsatisfied", value: 10 },
];

const pieColors = ["#10b981", "#3b82f6", "#ef4444"];

export default function OwnerDashboard() {
  const [modal, setModal] = useState(null);
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-4 pt-6 pb-32">
      <OwnerBottomNav />
      <h1 className="text-2xl font-bold">Welcome back</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <DashboardCard
          icon={<CalendarDays className="w-5 h-5" />}
          label="Today’s Appointments"
          value={dashboardStats.appointmentsToday}
        />
        <DashboardCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Income This Month"
          value={`$${dashboardStats.incomeThisMonth}`}
          onClick={() => setModal("income")}
        />
        <DashboardCard
          icon={<Users className="w-5 h-5" />}
          label="Barbers"
          value={dashboardStats.barbers}
          onClick={() => setModal("barbers")}
        />
        <DashboardCard
          icon={<Scissors className="w-5 h-5" />}
          label="Top Service"
          value={dashboardStats.topService}
          onClick={() => setModal("services")}
        />
      </div>

      {/* Shop Card */}
      <div className="mt-4 bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Shop</h2>
          <Link to="/owner/settings" className="text-blue-500 text-sm flex gap-1">
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
        </div>
        <div className="w-full h-36 bg-zinc-300 dark:bg-zinc-700 rounded-xl mt-3 flex justify-center items-center">
          <Image className="w-6 h-6 text-white opacity-60" />
          <span className="ml-2 text-white opacity-70">Shop Images</span>
        </div>
      </div>

      {/* Income Trend Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">📈 Income Trend</h3>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border rounded-md p-1 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
            >
              <option value="month">This Month</option>
            </select>
            <Link to="/owner/analytics" className="text-blue-500 text-sm flex gap-1">
              <BarChart2 className="w-4 h-4" />
              View
            </Link>
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeTrendMonth}>
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Satisfaction Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm mt-4">
        <h3 className="text-lg font-semibold mb-2">Client Satisfaction</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={satisfactionData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {satisfactionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modals */}
      <StatModal
        open={modal === "income"}
        onClose={() => setModal(null)}
        title="Barber Income"
      >
        <ul className="space-y-2 text-sm">
          {barberPerformance.map((b) => (
            <li key={b.name} className="flex justify-between">
              <span>{b.name}</span>
              <span className="flex items-center gap-1 font-medium text-green-500">
                ${b.income}
                {b.income > 1000 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              </span>
            </li>
          ))}
        </ul>
      </StatModal>

      <StatModal
        open={modal === "barbers"}
        onClose={() => setModal(null)}
        title="Team Overview"
      >
        <ul className="space-y-2 text-sm">
          {barberPerformance.map((b) => (
            <li key={b.name} className="flex justify-between">
              <span>
                {b.name}
                <span
                  className={`ml-1 text-xs ${
                    b.active ? "text-green-500" : "text-zinc-400"
                  }`}
                >
                  ({b.active ? "Active" : "Inactive"})
                </span>
              </span>
              <span>{b.appointments} appts</span>
            </li>
          ))}
        </ul>
      </StatModal>

      <StatModal
        open={modal === "services"}
        onClose={() => setModal(null)}
        title="Top Services"
      >
        <ul className="space-y-2 text-sm">
          {topServices.map((s, i) => (
            <li key={s.name} className="flex justify-between">
              <span>
                {i + 1}. {s.name}
              </span>
              <span>{s.count} times</span>
            </li>
          ))}
        </ul>
      </StatModal>
    </div>
  );
}

function DashboardCard({ icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm flex items-center gap-3 w-full text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
    >
      <div className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-lg">{icon}</div>
      <div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">{label}</div>
        <div className="font-semibold text-lg">{value}</div>
      </div>
    </button>
  );
}

function StatModal({ open, onClose, title, children }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-zinc-900 dark:text-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-red-500">
              <X />
            </button>
          </div>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
