import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  UserPlus,
  Trash2,
  Search,
  Users,
  Loader2,
  CalendarDays,
  BarChart,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";
import {
  BarChart as Chart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function BarbersManagement() {
  const [barbers, setBarbers] = useState([
    {
      id: "1",
      name: "Ali Mansour",
      image: "/barber1.jpg",
      status: "Available",
      appointments: 5,
      nextSlot: "Today at 14:00",
      income: 320,
      growth: 12,
    },
    {
      id: "2",
      name: "Yassine Ben Ali",
      image: "/barber2.jpg",
      status: "Busy",
      appointments: 3,
      nextSlot: "Tomorrow at 11:00",
      income: 270,
      growth: -8,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [range, setRange] = useState("month");

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleRemove = () => {
    if (selectedBarber) {
      setBarbers((prev) => prev.filter((barber) => barber.id !== selectedBarber.id));
      setRemoveModalOpen(false);
    }
  };

  const colors = ["#10b981", "#3b82f6", "#f59e0b"];
  const sortedBarbers = [...barbers].sort((a, b) => b.income - a.income);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-4 pb-24 space-y-4 text-zinc-900 dark:text-white pt-16 transition-colors duration-300">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users className="w-6 h-6" /> Team Management
      </h1>
      <OwnerBottomNav />

      <div className="flex items-center gap-3">
        <div className="flex items-center px-3 py-2 rounded-md border w-full bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search barbers..."
            className="ml-2 flex-1 text-sm bg-transparent outline-none text-black dark:text-white"
          />
        </div>
        <button
          onClick={() => setInviteModalOpen(true)}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm flex items-center gap-1"
        >
          <UserPlus className="w-4 h-4" />
          Add
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{barber.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {barber.status} · {barber.appointments} appointments
                  </p>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                    <CalendarDays className="w-4 h-4" /> {barber.nextSlot}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                <span className="font-semibold text-green-500">${barber.income}</span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    barber.growth >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {barber.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(barber.growth)}%
                </span>
                <button
                  onClick={() => {
                    setSelectedBarber(barber);
                    setRemoveModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart className="w-5 h-5" /> Barber Performance
          </h2>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="text-sm bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded-md"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={sortedBarbers}>
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="income">
                {sortedBarbers.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </Chart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 pt-2">
          {sortedBarbers.map((barber, index) => (
            <div
              key={barber.name}
              className="flex items-center justify-between text-sm border-b py-1 dark:border-zinc-700"
            >
              <span>
                {index + 1}. <strong>{barber.name}</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-zinc-500 dark:text-zinc-400">${barber.income}</span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    barber.growth >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {barber.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(barber.growth)}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      <Dialog
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-zinc-800 dark:text-white p-6 rounded-xl max-w-md w-full space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add Barber via Code</h2>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-zinc-500 hover:text-red-500"
              >
                <X />
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter Barber Code..."
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            />
            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md w-full text-sm font-medium">
              Add Barber
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Remove Modal */}
      <Dialog
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-zinc-800 dark:text-white p-6 rounded-xl max-w-sm w-full space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-center">Confirm Removal</h2>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              Are you sure you want to remove <strong>{selectedBarber?.name}</strong> from
              your shop?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="bg-zinc-100 dark:bg-zinc-700 text-sm px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Remove
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
