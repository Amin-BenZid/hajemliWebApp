import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CalendarDays,
  DollarSign,
  User,
  TrendingUp,
  TrendingDown,
  Scissors,
  BarChart3,
  Star,
} from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";

const incomeStats = {
  week: {
    data: [
      { label: "Mon", value: 300 },
      { label: "Tue", value: 420 },
      { label: "Wed", value: 360 },
      { label: "Thu", value: 500 },
      { label: "Fri", value: 700 },
      { label: "Sat", value: 950 },
      { label: "Sun", value: 600 },
    ],
    total: 3830,
    previous: 3400,
  },
  month: {
    data: [
      { label: "Week 1", value: 1800 },
      { label: "Week 2", value: 2300 },
      { label: "Week 3", value: 2150 },
      { label: "Week 4", value: 3000 },
    ],
    total: 9250,
    previous: 8700,
  },
  year: {
    data: [
      { label: "Jan", value: 4000 },
      { label: "Feb", value: 3500 },
      { label: "Mar", value: 4200 },
      { label: "Apr", value: 3800 },
      { label: "May", value: 5000 },
      { label: "Jun", value: 4800 },
    ],
    total: 25300,
    previous: 24000,
  },
};

const appointmentsData = [
  { label: "Mon", appts: 6, canceled: 1 },
  { label: "Tue", appts: 9, canceled: 0 },
  { label: "Wed", appts: 7, canceled: 1 },
  { label: "Thu", appts: 5, canceled: 2 },
  { label: "Fri", appts: 10, canceled: 1 },
  { label: "Sat", appts: 12, canceled: 0 },
  { label: "Sun", appts: 4, canceled: 1 },
];

const servicesData = [
  { name: "Skin Fade", value: 35 },
  { name: "Beard Trim", value: 22 },
  { name: "Hair Color", value: 12 },
  { name: "Kids Cut", value: 15 },
];

const barbersData = [
  { name: "Ali", value: 40 },
  { name: "Sami", value: 28 },
  { name: "Hamza", value: 21 },
  { name: "Yassine", value: 17 },
];

const satisfactionData = [
  { rating: "5★", count: 42 },
  { rating: "4★", count: 18 },
  { rating: "3★", count: 6 },
  { rating: "2★", count: 3 },
  { rating: "1★", count: 1 },
];

const individualBarbers = {
  Ali: {
    income: 3200,
    appts: 40,
    trend: [
      { label: "Week 1", value: 600 },
      { label: "Week 2", value: 700 },
      { label: "Week 3", value: 800 },
      { label: "Week 4", value: 1100 },
    ],
  },
  Sami: {
    income: 2100,
    appts: 28,
    trend: [
      { label: "Week 1", value: 400 },
      { label: "Week 2", value: 500 },
      { label: "Week 3", value: 500 },
      { label: "Week 4", value: 700 },
    ],
  },
};

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];

export default function OwnerAnalytics() {
  const [selectedBarber, setSelectedBarber] = useState("Ali");
  const [range, setRange] = useState("week");

  const incomeData = incomeStats[range].data;
  const currentTotal = incomeStats[range].total;
  const previousTotal = incomeStats[range].previous;
  const growth = ((currentTotal - previousTotal) / previousTotal) * 100;
  const growthIcon =
    growth >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  const growthColor = growth >= 0 ? "text-green-500" : "text-red-500";
  const currentBarber = individualBarbers[selectedBarber];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors duration-300 p-4 pb-24 pt-16 space-y-8">
      <div className="flex items-center justify-between">
        <OwnerBottomNav />
        <h1 className="text-2xl font-bold flex items-center gap-2 text-black dark:text-white">
          <BarChart3 className="w-6 h-6" /> Shop Analytics
        </h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-sm border rounded-md p-1 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Income Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Income ({range})
          </h2>
          <p className={`text-sm flex items-center gap-1 ${growthColor}`}>
            {growthIcon} {Math.abs(growth).toFixed(1)}% vs last {range}
          </p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointments Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <CalendarDays className="w-5 h-5" /> Appointments vs Cancellations
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appointmentsData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appts" fill="#10b981" barSize={18} name="Appointments" />
              <Bar dataKey="canceled" fill="#ef4444" barSize={18} name="Canceled" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services Pie Chart */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Scissors className="w-5 h-5" /> Top Services
        </h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={servicesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {servicesData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Satisfaction Ratings */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" /> Client Satisfaction
        </h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={satisfactionData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="rating" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barber Productivity */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <User className="w-5 h-5" /> Barber Productivity
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barbersData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Barber Details */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="w-5 h-5" /> Barber Details
          </h2>
          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
            className="text-sm border rounded-md p-1 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
          >
            {Object.keys(individualBarbers).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm mb-2">
          Total Income: <strong>${currentBarber.income}</strong>
          <br />
          Appointments: <strong>{currentBarber.appts}</strong>
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentBarber.trend}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
