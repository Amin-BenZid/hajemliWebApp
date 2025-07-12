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
import { useAuth } from "../../context/AuthContext";
import { fetchShopByOwnerId, fetchShopById, fetchBarbersSummaryByShopId, fetchBarberMonthlyIncome, fetchBarberYearlyIncome, addBarberToShop, removeBarberFromShop } from "../../services/api";

export default function BarbersManagement() {
  const { user, role } = useAuth();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [range, setRange] = useState("month");
  const [performanceData, setPerformanceData] = useState([]);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [addBarberCode, setAddBarberCode] = useState("");
  const [addBarberLoading, setAddBarberLoading] = useState(false);
  const [addBarberError, setAddBarberError] = useState("");
  // Store shopId for add barber
  const [shopId, setShopId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      try {
        let shopIdValue = null;
        if (role === "owner" && user?.owner_id) {
          const ownerShop = await fetchShopByOwnerId(user.owner_id);
          shopIdValue = ownerShop.shop_id;
        } else if (role === "worker" && user?.shop_id) {
          shopIdValue = user.shop_id;
        }
        setShopId(shopIdValue);
        if (shopIdValue) {
          const barbersData = await fetchBarbersSummaryByShopId(shopIdValue);
          setBarbers(barbersData);
        } else {
          setBarbers([]);
        }
      } catch (err) {
        setBarbers([]);
      }
      setLoading(false);
    };
    fetchBarbers();
    // eslint-disable-next-line
  }, [user, role]);

  useEffect(() => {
    const fetchPerformance = async () => {
      setPerformanceLoading(true);
      try {
        let data = [];
        for (const barber of barbers) {
          let income = 0;
          if (range === "month") {
            const res = await fetchBarberMonthlyIncome(barber.barber_id);
            income = res.income || 0;
          } else if (range === "year") {
            const res = await fetchBarberYearlyIncome(barber.barber_id);
            income = res.income || 0;
          }
          data.push({ ...barber, performanceIncome: income });
        }
        setPerformanceData(data.sort((a, b) => b.performanceIncome - a.performanceIncome));
      } catch (err) {
        setPerformanceData([]);
      }
      setPerformanceLoading(false);
    };
    if (barbers.length > 0) fetchPerformance();
    else setPerformanceData([]);
  }, [barbers, range]);

  const handleRemove = async () => {
    if (selectedBarber && shopId) {
      setRemoveLoading(true);
      try {
        await removeBarberFromShop(shopId, selectedBarber.barber_id);
        // Refresh barbers list
        const barbersData = await fetchBarbersSummaryByShopId(shopId);
        setBarbers(barbersData);
        setRemoveModalOpen(false);
      } catch (err) {
        // Optionally show an error message
      }
      setRemoveLoading(false);
    }
  };

  const handleAddBarber = async () => {
    setAddBarberLoading(true);
    setAddBarberError("");
    if (!addBarberCode.trim()) {
      setAddBarberError("Please enter a barber code.");
      setAddBarberLoading(false);
      return;
    }
    try {
      await addBarberToShop(shopId, addBarberCode.trim());
      setInviteModalOpen(false);
      setAddBarberCode("");
      // Refresh barbers list
      if (shopId) {
        const barbersData = await fetchBarbersSummaryByShopId(shopId);
        setBarbers(barbersData);
      }
    } catch (err) {
      setAddBarberError("Barber not found or could not be added. Please check the code and try again.");
    }
    setAddBarberLoading(false);
  };

  const colors = ["#10b981", "#3b82f6", "#f59e0b"];
  const sortedBarbers = [...barbers].sort((a, b) => b.totalIncome - a.totalIncome);
  // Filtered barbers for search
  const filteredBarbers = searchTerm.trim()
    ? barbers.filter(
        b =>
          b.barber_id.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          b.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : barbers;

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
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
          {filteredBarbers.map((barber) => (
            <div
              key={barber.barber_id}
              className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={barber.profile_image}
                  alt={barber.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{barber.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {barber.availability} · {barber.appointmentsToday} appointments
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                <span className="font-semibold text-green-500">${barber.totalIncome}</span>
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
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {performanceLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : (
          <>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <Chart data={performanceData}>
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip />
                  <Bar dataKey="performanceIncome">
                    {performanceData.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </Chart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2">
              {performanceData.map((barber, index) => (
                <div
                  key={barber.barber_id}
                  className="flex items-center justify-between text-sm border-b py-1 dark:border-zinc-700"
                >
                  <span>
                    {index + 1}. <strong>{barber.name}</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400">${barber.performanceIncome}</span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
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
              value={addBarberCode}
              onChange={e => setAddBarberCode(e.target.value)}
              disabled={addBarberLoading}
            />
            {addBarberError && (
              <div className="text-red-500 text-sm text-center">{addBarberError}</div>
            )}
            <button
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md w-full text-sm font-medium flex items-center justify-center"
              onClick={handleAddBarber}
              disabled={addBarberLoading}
            >
              {addBarberLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Barber"}
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
                disabled={removeLoading}
              >
                {removeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
