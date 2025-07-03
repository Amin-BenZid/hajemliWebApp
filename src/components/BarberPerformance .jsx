// components/BarberPerformance.jsx
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const fakeBarberStats = {
  week: [
    { name: "Ali", value: 12 },
    { name: "Yassine", value: 9 },
    { name: "Walid", value: 7 },
  ],
  month: [
    { name: "Ali", value: 42 },
    { name: "Yassine", value: 38 },
    { name: "Walid", value: 31 },
  ],
  year: [
    { name: "Ali", value: 421 },
    { name: "Yassine", value: 389 },
    { name: "Walid", value: 342 },
  ],
};

const colors = ["#10b981", "#3b82f6", "#f59e0b"];

export default function BarberPerformance() {
  const [range, setRange] = useState("month");

  const data = fakeBarberStats[range];

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart className="w-5 h-5" /> Barber Performance
        </h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranking List */}
      <div className="space-y-2 pt-2">
        {data
          .sort((a, b) => b.value - a.value)
          .map((barber, index) => (
            <div
              key={barber.name}
              className="flex items-center justify-between text-sm border-b py-1 dark:border-zinc-700"
            >
              <span>
                {index + 1}. <strong>{barber.name}</strong>
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {barber.value} cuts
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
